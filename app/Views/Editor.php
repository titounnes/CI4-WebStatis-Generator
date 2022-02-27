<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Blog Generator | titounnes</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="theme">
<meta content='id' name='language' />
<meta content='id' name='geo.country' />
<meta content='Indonesia' name='geo.placename' />
<meta name="author" content="Harjito, Harjito@example.com">
<link rel="shortcut icon" href="/favicon.ico?v=3" type="image/x-icon">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="e-Project">
<meta name="msapplication-TileImage" content="favicon.ico?v=3">
<meta name="msapplication-TileColor" content="#2F3BA2">
<meta name="description" content="The 17th Join Conference on Chemistry (JCC 2022) | jcc.unnes.ac.id">
<meta name="keywords" content="JCC, conference, Jurusan Kimia UNNES, UNNES, Join Conference on Chemistry" />
<link rel="shortcut icon" type="image/png" href="/favicon.ico?v=3" />
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" rel="stylesheet">
<link href="/css/style.css?v=1644917511" rel="stylesheet">
<script src="/js/head.js?v=1643681730"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script type="text/javascript" src="https://unpkg.com/qr-code-styling/lib/qr-code-styling.js"></script>
<head>
<body>
<div class="container">
    <main class="container-xxl">
        <h3 class="title text-center">{title}</h3>
        <h5 class="title text-center">{sub_title}</h5>
        <div class="row">
            <div class="col col-md-6">
                <a class="link link-info" targetUrl="/configuration" href="#editor">Config</a>
                <a class="link link-info" targetUrl="#" href="#layout">Layout</a>
                <a class="link link-info" targetUrl="#" href="#content">Content</a>
                <select class="form-control" hidden id="list"></select>
                <textarea id="editor" class="form-control" style="height:500px">
                </textarea>
                <button class="btn btn-info btn-save">Save</button>
                <button class="btn btn-info btn-publish">Publish</button>
            </div>
            <div class="col col-md-6">
                <h4>Preview</h4>
                <iframe id="preview" src="/dev/index.html" style="width:100%;height:600px;max-height:70vh" frameborder="0"></iframe>
            </div>        
        </div>
    </main>
</div>
<script>
    {noparse}
    const LINKS = new tito('.link');
    const EDITOR = new tito('#editor');
    const BTN = new tito('.btn');
    const PREVIEW = new tito('#preview');
    const LIST = new tito('#list');
    const CONTENT = new tito('#content');
    var target;
    LINKS.bind('click', function(e){
        e.preventDefault();
        if(this.getAttribute('targetUrl').indexOf('#')<0){
            LIST.selector[0].hidden = true;
            window.param = '';
            target = this.getAttribute('targetUrl');
            const req = new ajax(target, 'get', '', function(){
                EDITOR.selector[0].value = this.response;
            })
            req.send()
        }else{
            LIST.selector[0].hidden = false;
            EDITOR.selector[0].value = '';
            window.active = this.getAttribute('href').replace(/#/,''); 
            target = '/'+window.active
            const req = new ajax(target, 'get', '', function(){
                var file = JSON.parse(this.response)
                LIST.selector[0].innerHTML = '<option value="">Choose One</option>';
                for(var i of file){
                    const OPT = document.createElement('OPTION');
                    OPT.setAttribute('value', i.path =='' ? i.name : i.path+':'+i.name)
                    OPT.textContent = i.name;
                    LIST.selector[0].appendChild(OPT);
                }
            })
            req.send()
        }
    })

    BTN.bind('click', function(e){
        e.preventDefault();
        if(!target) return;
        data = {
            name : window.param,
            content: EDITOR.selector[0].value,
        }
        if(this.textContent.toUpperCase()=='SAVE'){
            if(window.save) return;
            window.save = true;
            url = target.replace(/part/,'save');            
            const req = new ajax(url, 'post', data, function(){
                if(window.active=='content'){
                    PREVIEW.selector[0].src = '/dev/'+data.name.replace(':','/')+'.html';
                }else{
                    PREVIEW.selector[0].src +='';
                }
                window.save = false;
            })
            req.send()
        }
    })
    LIST.bind('change', function(){
        target = window.active+'/part'
        window.param = this.value;
        const req = new ajax(target, 'post', {data:param}, function(){
            EDITOR.selector[0].value = this.response;
        })
        req.send()
    })
    {/noparse}
</script>
</body>
</html>
