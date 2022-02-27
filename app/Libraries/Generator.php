<?php 

namespace App\Libraries;

use Michelf\MarkdownExtra;
use Parsedown;

class Generator
{
    
    protected $yaml;

    protected $rootDir;
    
    protected $tempDir;

    protected $partialDir;

    protected $templateHTML;

    protected $mdfile;

    function __construct(string $rootDir, string $typefile, string $subdir, string $name = 'index.html', $mdfile = ''){
        
        $this->rootDir = $rootDir;

        $yamlFile = $rootDir . 'config.yml';

        if( file_exists($yamlFile) ) {
            $this->yaml = yaml_parse_file($yamlFile, 0);  
        }     
        
        $this->tempDir = $rootDir . $typefile .'/';

        $file = $this->tempDir . $name;
        
        $this->partialDir = $this->tempDir . $subdir . '/';

        $this->templateHTML = preg_replace("/[\n\r\t]/", '',file_get_contents($file));

        $this->md = new MarkdownExtra();
        $this->mdfile = $mdfile; 
    }

    public function parse(){
        $this->includePartial();
        $this->parsingLoop();
        $this->parsingSingle();
        return preg_replace("/\>\s+\</",'><', $this->templateHTML);
    }

    public function parseContent(){
        $meta = yaml_parse_file($this->mdfile); 
        $text =  preg_replace("/[\n\r\t]/", "|", file_get_contents($this->mdfile)); 
        $text = preg_replace("/\-{3}(.*?)\-{3}/", "", $text);
        $text = preg_replace("/\|/", "\n", $text);
        $text = $this->md::defaultTransform($text);
        return $text;
        // $md = new Parsedown();
        // preg_match_all("/\-{3}(.+?)\-{3}/", $this->templateHTML, $result);
        // return yaml_parse($result[1][0], 0);
        // return $md->text($this->templateHTML);

        // $this->parsingStandard();
        // $this->parsingLoop();
        // $this->parsingSingle();
        return yaml_parse( $this->templateHTML ,-1);
    }

    public function includePartial(){
        preg_match_all("/\@include\s+\"(.+?)\"/", $this->templateHTML, $result);
        if(!$result) return;
        $tag = [];
        $repl = [];
        foreach($result[1] as $k=>$v){
            $repl[] = file_get_contents($this->partialDir . $v);
            $tag[] = $result[0][$k];
        }
        $this->templateHTML = str_replace($tag, $repl, $this->templateHTML);     
    } 

    public function parsingloop()
    {
        preg_match_all("/\{+\s+with\s+(.+?)\s+\}+(.*?)\{+\s+end\s+\}+/ms", $this->templateHTML, $result);    
        foreach($result[2] as $key=>$r){
            $segments = explode('.', trim($result[1][$key],'.')); 
            $data = null;
            foreach($segments as $segment){
                if(!isset($data)){
                    $data = $this->yaml[$segment] ?? null;
                }else{
                    if(isset($data)) $data = $data[$segment] ?? null;
                }
                
            }
            // d($data);
            preg_match_all("/\{+\s+(.+?)\s+\}+/", $r, $r2);
            $search = [];
            $repl = [];
            $filter = [];
            foreach($r2[1] as $k => $v){
                $f='null';
                if(strpos($v, '|')!==FALSE){
                    $part = explode('|', $v);
                    $v = trim($part[0]);
                    $f = trim($part[1]);
                }
                $v = trim($v);
                $search[$v] = $r2[0][$k];
                if(isset($data[$v])){
                    foreach($data[$v] as $i=>$d){
                        switch($f){
                            case 'markdownify' :
                                $repl[$i][$v] = str_replace(['<p>','</p>'],['',''], $this->md::defaultTransform($d));
                                break;
                            case 'baseURL' : 
                                $repl[$i][$v] = $this->yaml['baseURL'] . $d;
                                break; 
                        }
                    }
                }else{
                    $repl[$v][] = $r2[0][$k];
                }
            }
            $html = [];    
            foreach($repl as $k=>$v){
                $html[] = str_replace($search, $repl[$k],$r );
            }
            $this->templateHTML = str_replace($result[0][$key], join('', $html),$this->templateHTML);
        }
        // $this->templateHTML = preg_replace("/\{+(.*?)\}+/",'', $this->templateHTML);
    }

    public function parsingSingle()
    {
        preg_match_all("/\{+\s(.+?)\s+\}+/", $this->templateHTML, $result);
        if(!$result) return;
        foreach($result[1] as $key=>$var){
            $segments = explode('|', $var);
            $html = '';
            if(isset($segments[1])){
                switch(trim($segments[1])){
                    case 'baseURL' :
                        $html = $this->yaml['baseURL'] . trim($segments[0]);
                        break;
                    case 'markdownify' :
                        $data = $this->yaml[trim($segments[0])]??null;
                        if($data){
                            if(is_array($data)){
                                $data = join(', ', $data);
                            }    
                            $html = str_replace(['<p>','</p>'], '',  $this->md::defaultTransform($data));
                        }
                        break;
                }
            }else{
                $data = $this->yaml[$var] ?? null;
                if($data){
                    if(is_array($data)){
                        $data = join(', ', $data);
                    }    
                    $html = str_replace(['<p>','</p>'], '',  $this->md::defaultTransform($data));
                }
            }
            $this->templateHTML = str_replace($result[0][$key], $html, $this->templateHTML);
        }
    }
}