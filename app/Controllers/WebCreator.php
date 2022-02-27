<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Libraries\Generator;
class WebCreator extends BaseController
{

    public function index()
    {
        $parser = \Config\Services::parser(); 
        return $parser->setData([
            'title' => 'Web Statis Builder',
            'sub_title' => 'Version 1.0',
        ])->render('Editor');
    }

    public function generateIndex(){

        $generator = new Generator($this->contentPath, 'layout', 'partial', 'index.html');
        $result = $generator->parse(); 
        
        file_put_contents(FCPATH.'dev/index.html', $result);
        echo($result);
    }

    public function generateContent()
    {
        
    }

}
