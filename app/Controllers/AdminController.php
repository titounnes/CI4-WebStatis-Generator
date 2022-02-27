<?php

namespace App\Controllers;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
use CodeIgniter\API\ResponseTrait;
use App\Libraries\Generator;

class AdminController extends BaseController
{
    protected $contentPath = WRITEPATH . 'data/';

    public function generate($file, $data)
    {
        file_put_contents($this->contentPath. $file, $data);
        $generator = new Generator($this->contentPath, 'layout', 'partial', 'index.html' ,'');
        $result = $generator->parse(); 
        file_put_contents(FCPATH.'dev/index.html', $result);
        return $result;
    }

    public function generateContent($file, $data)
    {
        $part = [];
        if(strpos(':', $file)!==FALSE){
            $part = explode(':', $file);
            if(!is_dir($this->contentPath. $part[0])){
                mkdir($this->contentPath. $part[0]);
            }
        }else{
            $part[0] = '';
            $part[1] = $file;
        }
        $mdfile = $this->contentPath. 'content/'. join('/',$part).'.md';
        file_put_contents($mdfile, $data);
        $generator = new Generator($this->contentPath, 'layout', '', 'page.html', $mdfile);
        $result = $generator->parseContent(); 
        file_put_contents(FCPATH.'dev/'.join('/',$part).'.html', $result);
        return $result;
    }
}
