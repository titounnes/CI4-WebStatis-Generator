<?php

namespace App\Controllers;
use \Myth\Auth\Authorization\GroupModel;
use \Myth\Auth\Models\UserModel;

class Home extends BaseController
{
    public function index()
    {
        return view('welcome_message');
    }
}
