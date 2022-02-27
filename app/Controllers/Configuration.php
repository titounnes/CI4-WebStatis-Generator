<?php

namespace App\Controllers;

use App\Controllers\AdminController;
class Configuration extends AdminController
{

    public function index()
    {
        return file_get_contents($this->contentPath. 'config.yml');
    }

    function Save()
    {
        $r = $this->response->setContentType('application/json');
        $result = $this->generate('config.yml', $this->request->getVar('content'));
		return $r->setJSON( ['status'=>'ok', 'result'=>$result] );
    }
}
