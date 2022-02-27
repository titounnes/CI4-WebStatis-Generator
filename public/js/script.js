if (location.host.indexOf('localhost') >= 0) {
    var source = new EventSource("/stream");
    source.onmessage = function (event) {
        if (event.data == 'reload') {
            location.reload()
        }
    };
}

var myModal = new bootstrap.Modal(document.getElementById('modal'), {
    keyboard: false, backdrop: 'static'
})
var modalBody = document.getElementById('modal-body');
const modalSelectTitle = new tito('#modal-title-select')
// Tabbed
var tabbed = new tito('.pri-link')
var panel = new tito('.panel');
tabbed.bind('click', function () {
    for (var el of tabbed.selector) {
        el.setAttribute('class', el.getAttribute('class').replace(/ active/, ''));
    }
    this.setAttribute('class', this.getAttribute('class') + ' active');
    for (var el of panel.selector) {
        el.setAttribute('hidden', true);
    }
    const target = new tito('#panel-' + this.getAttribute('id').replace(/btn-/, ''))
    target.remAttr('hidden');
})

// Table editable
const editTable = new tito('.td-edit');
const dataTable = {}

editTable.bind('keyup', function (e) {
    const cl = this.getAttribute('class').split('td-edit');
    const name = cl[0].trim()
    const extraClass = cl[1].trim()
    if (window.pattern[name]) {
        const pattern = '^' + window.pattern[name] + '$';
        window.regex = new RegExp(pattern).test(this.textContent);
        if (window.regex && extraClass == 'date') {
            const dt = new Date(this.textContent)
            window.regex = dt.getTime()
        }
    }
    requireTd = new tito('td')
    for (var el of requireTd.selector) {
        if (el.getAttribute('require') == name) {
            // console.log(el)
        }
    }

    window.elError = null;
    if (!window.regex) {
        return showalert(e.target, name)
    }
})

editTable.bind('mouseover', function () {
    if (!window.regex && window.elError != this) {
        return;
    }
    if (!this.getAttribute('dissable')) this.setAttribute('contentEditable', true)
    // this.focus();
    dtAlert.setAttr('hidden')
    dataTable[this.getAttribute('class').replace(/ /g, '-') + '_' + this.getAttribute('data')] = this.textContent.trim()
})

editTable.bind('click', function () {
    if (!window.regex && window.elError != this) {
        return;
    }
    if (!this.getAttribute('dissable')) this.setAttribute('contentEditable', true)
    this.focus();
    dtAlert.setAttr('hidden')
    dataTable[this.getAttribute('class').replace(/ /g, '-') + '_' + this.getAttribute('data')] = this.textContent.trim()
})

// var obj;
editTable.bind('blur', function () {
    if (this.textContent == '') {
        this.setAttribute('placeholder', window.title[this.getAttribute('class').split(' ')[0]])
    }
    blur(this)
})

const statusEdit = new tito('#status-edit');

function blur(e) {
    // if (e.textContent == '' && window.pattern[e.getAttribute('class').split(' ')[0]] != '.*') return;
    if (e.textContent == e.getAttribute('value')) return;
    if (e.getAttribute('class').indexOf('recalculate') > 0) return;
    const id = dataTable[e.getAttribute('class').replace(/ /g, '-') + '_' + e.getAttribute('data')];
    window.obj = e;
    window.data = {};
    window.data[e.getAttribute('class').split(' ')[0]] = e.textContent.trim();
    window.data.id = e.getAttribute('rec')
    // console.log(window.data)
    const req = new ajax(window.target, 'post', window.data, changeTd)
    req.send()
}

function changeTd() {
    const res = JSON.parse(this.response);
    // console.log(res, window.data)
    if (!res[0] || res[0] == '') return
    txt = 'Last updated at ' + res[0];
    statusEdit.html(txt)
    if (res.error) {
        window.obj.setAttribute('contentEditable', true)
        const cl = window.obj.getAttribute('class');
        if (cl.split(' ').length == 2) {
            window.obj.setAttribute('class', cl + ' error')
        }
        window.obj.focus();
        var mess = ''
        for (var er in res.error) {
            mess += res.error[er]
        }
        dtAlert.html('<p>' + mess + '</p>')
        dtAlert.remAttr('hidden')
        setTimeout(() => {
            dtAlert.setAttr('hidden')
        }, 3000);
    } else {
        window.obj.setAttribute('value', window.obj.textContent)
    }
}

const tdSelect = new tito('.td-select');
tdSelect.bind('change', function () {
    id = this.parentNode.getAttribute('rec')
    field = this.getAttribute('class').split(' ')[0]
    window.data = {}
    window.data.id = id;
    window.data[field] = this.value;
    const req = new ajax(window.target, 'post', window.data, function () {
        const res = JSON.parse(this.response);
        if (!res[0] || res[0] == '') return
        txt = 'Last updated at ' + res[0];
        console.log(res)
    })
    req.send()
})

const dtAlert = new tito('#datatable-alert');
function showalert(e, name) {
    const coor = e.getBoundingClientRect();
    dtAlert.html(window.title[name])
    dtAlert.remAttr('hidden')
    dtAlert.selector[0].style.position = 'absolute';
    dtAlert.selector[0].style.left = coor.left + 'px';
    dtAlert.selector[0].style.top = (coor.top + coor.height) + 'px'
    setTimeout(() => {
        dtAlert.setAttr('hidden');
        window.regex = true;
    }, 5000);
}

function keyDown(e) {
    if (window.pos && window.pos == 'info') return;
    if (['Home', 'End'].indexOf(e.key) >= 0) {
        if (e.target.nodeName == 'TD') {
            const child = e.target.parentElement.children;
            if (e.key == 'Home') {
                for (i = 0; i < child.length - 1; i++) {
                    if (child[i].getAttribute('contentEditable') == 'true') {
                        return child[i].focus();
                    }
                }
            } else {
                for (i = child.length - 1; i >= 0; i--) {
                    if (child[i].getAttribute('contentEditable') == 'true') {
                        return child[i].focus();
                    }
                }
            }
        }
    }
    if (e.key == 'F2') {
        const hint = new tito('.hint');
        if (!hint || hint.selector.length == 0) return;
        if (!sessionStorage['hint'] || sessionStorage['hint'] == 'hide') {
            sessionStorage['hint'] = 'show';
            return document.getElementsByClassName('hint')[0].removeAttribute('hidden')
        }
        sessionStorage['hint'] = 'hide';
        return document.getElementsByClassName('hint')[0].setAttribute('hidden', true)
    }
    if (e.key == 'Tab') {
        // if (modalLargeBody.selector[0].textContent.trim() == '') {
        //     e.preventDefault();
        //     const tdEditLength = editTable.selector.length;
        //     for (var i = 0; i < tdEditLength; i++) {
        //         if (editTable.selector[i] == e.target) {
        //             if (i < tdEditLength - 1) {
        //                 return editTable.selector[i + 1].focus();
        //             } else {
        //                 return editTable.selector[0].focus();
        //             }
        //         }
        //     }
        // }
        return;
    }
    if (e.code == 'KeyP' && e.ctrlKey) {
        e.preventDefault();
        if (typeof printReport == 'function') {
            return printReport();
        }
    }
    if (['ArrowDown', 'ArrowUp', 'PageUp', 'PageDown'].indexOf(e.key) >= 0) {
        const obj = e.target.getAttribute('class');
        if (!obj) return;
        const cl = new tito('.' + obj.split(' ')[0].trim());
        clLength = cl.selector.length;
        for (var i = 0; i < clLength; i++) {
            if (cl.selector[i] == e.target) {
                switch (e.key) {
                    case 'ArrowDown':
                        if (i < clLength - 1) {
                            cl.selector[i + 1].focus();
                            break;
                        }
                        cl.selector[0].focus();
                        break;
                    case 'ArrowUp':
                        if (i == 0) {
                            cl.selector[clLength - 1].focus();
                            break;
                        }
                        cl.selector[i - 1].focus();
                        break;
                    case 'PageDown':
                        if (i < clLength - 1) {
                            cl.selector[clLength - 1].focus();
                            break;
                        }
                        cl.selector[0].focus();
                        break;
                    case 'PageUp':
                        if (i > 0) {
                            cl.selector[0].focus();
                            break;
                        }
                        cl.selector[clLength - 1].focus();
                        break;
                }
            }
        }
    }
    if (e.key == 'F1') {
        e.preventDefault();
        if (window.location.href.split(window.location.host)[1] != '/help/guide') {
            return this.location.href = '/help/guide';
        }
        return false;
    }
    const cl = e.target.getAttribute('class');
    if (!cl) return false;
    if (cl.indexOf('number') >= 0 && !(new RegExp('^[0-9]$')).test(e.key) && ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.'].indexOf(e.key) < 0) {
        return e.preventDefault();
    } else {
        if (e.target.getAttribute('min') && e.target.getAttribute('max')) {
            const min = e.target.getAttribute('min') * 1;
            const max = e.target.getAttribute('max') * 1;
            const curent = parseFloat(e.target.textContent + e.key);
            if (e.key == '.' && e.target.textContent.indexOf('.') > -1) {
                e.preventDefault();
            }
            if (curent > max || curent < min) {
                e.preventDefault();
                return showalert(e.target, cl.split(' ')[0])
            }
        }
    }
    const name = e.target.getAttribute('class').split(' ')[0]
    if (name == 'form-control' || (!window.pattern || !window.pattern[name])) return;
    const pola = window.pattern[name].split('{');
    if (e.shiftKey) window.shift = true;
    if (window.shift)
        var allow = pola[0].replace(/0-9/, '');
    else
        var allow = pola[0];
    const key = String.fromCharCode(e.keyCode);
    var regex = (new RegExp('^' + allow + '$')).test(key);
    if ([0, 8, 37, 39].indexOf(e.which) >= 0) {
        regex = true;
    }
}
document.addEventListener('keydown', keyDown)

const btnLink = new tito('.btn-modal-select')
const keyword = new tito('#keyword-search');
const resultSearch = new tito('#tb-search')
const confBody = new tito('#modal-body-confirm');
const selBody = new tito('#modal-body-select');
const titBody = new tito('#modal-title-select');

btnLink.bind('click', findLink);
var searchUrl;

function findLink(e) {
    resultSearch.html(' ')
    keyword.selector[0].value = '';
    searchUrl = this.href;
    if (searchUrl.indexOf('unlink') >= 0 || searchUrl.indexOf('delete') >= 0) {
        selBody.setAttr('hidden');
        confBody.remAttr('hidden');
        titBody.text(window.modal.title_unselect);
    } else if (searchUrl.indexOf('validation') >= 0 || searchUrl.indexOf('ancelation') >= 0) {
        selBody.setAttr('hidden');
        confBody.remAttr('hidden');
        titBody.text(window.modal.title);
    } else {
        selBody.remAttr('hidden');
        confBody.setAttr('hidden');
        titBody.text(window.modal.title_select);
        if (window.modal.unlink) {
            const tr = document.createElement('tr')
            tr.innerHTML = '<td>Kosongkan </td><td><a onclick="unlinkIt()" class="btn btn-warning"><i class="fa fa-times"></i></a></td>';
            selBody.selector[0].appendChild(tr)
        }
    }
}

keyword.bind('keyup', searchAuth)
var responseResult;

function searchAuth() {
    // console.log(searchUrl)
    if (this.value.length < 3) {
        resultSearch.html(' ')
    } else if (this.value.length == 3) {
        const ajaxSearch = new ajax(searchUrl.replace('link', 'search').replace(/#tabbed/, '') + '/' + this.value, 'get', '', fetchResult)
        ajaxSearch.send()
    } else {
        for (var tr of resultSearch.children()) {
            if (tr.textContent.indexOf(keyword.val()) < 0) {
                tr.setAttribute('hidden', true)
            }
        }
    }
}

function fetchResult() {
    console.log(this.response)
    const responseResult = JSON.parse(this.response).result;
    var html = [];
    for (var i in responseResult) {
        html.push('<tr>');
        html.push('<td>' + (responseResult[i]['email'] ? responseResult[i]['email'] : responseResult[i]['name']) + '</td>');
        html.push('<td><a class="btn btn-primary" data="' + responseResult[i]['id'] + '" onclick="linkIt( this, \'' + responseResult[i]['id'] + '\')"><i class="fa fa-check"></i></a></td>');
        html.push('</tr>');
    }
    resultSearch.html(html.join(''))
}

function linkIt(e, id) {
    return (new ajax(searchUrl.replace(/#tabbed/, '') + '/' + id, 'get', '', reload)).send()
}

const btnUnlink = new tito('#btn-unlink')
btnUnlink.bind('click', function (e) {
    e.preventDefault();
    if (window.data) {
        const req = new ajax(window.target, 'post', window.data, function () {
            if (window.target == '/member/register/delete/') {
                location.href = '/member/home/'
            } else {
                reload();
            }
        })
        req.send()
    } else {
        const req = new ajax(searchUrl, 'get', '', reload);
        req.send()
    }
})

var uploadMessage = document.createElement('P');
const btnUpload = new tito('.btn-upload')
btnUpload.bind('click', function (e) {
    e.preventDefault();
    myModal.show();
    modalBody.innerHTML = '';
    window.target = this.getAttribute('target');
    const segment = this.getAttribute('target').split('/');
    const typeDoc = { abstractDoc: 'Abstract', paperDoc: 'Full Paper' }
    const label = document.createElement('P')
    label.textContent = 'Please upload your version in docx format, maximum 2 Mb';
    const file = document.createElement('INPUT');
    file.setAttribute('type', 'file')
    file.setAttribute('class', 'btn btn-info');
    file.setAttribute('accept', '.docx');
    file.textContent = 'Choose File';
    file.addEventListener('change', filechoose)
    modalBody.appendChild(label);
    modalBody.appendChild(file);
    modalBody.appendChild(uploadMessage)
    uploadMessage.textContent = '';
})

function filechoose() {
    const file = this.files[0];
    const mimes = [
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
        'wps-office.docx',
        'msword',
        'x-zip'
    ]
    if (!file) return;
    const mime = file.type.split('/')[1];
    if (mimes.indexOf(mime) < 0) {
        uploadMessage.setAttribute('class', 'text-danger')
        return uploadMessage.textContent = 'Document not properly docx file. ';
    }
    if (file.size > 2097152) {
        uploadMessage.setAttribute('class', 'text-danger')
        return uploadMessage.textContent = 'Your document size greater than 2 Mb.';
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    uploadMessage.setAttribute('class', 'text-info')
    uploadMessage.textContent = 'uploading...';
    path = window.target.split('/')
    reader.onload = function () {
        const req = new ajax(window.target, 'post', { data: reader.result, name: window.target.split('/')[4] + '.docx' }, function () {
            // reload();
            uploadMessage.textContent = 'Document succesfully uploaded...';
            setTimeout(function () {
                reload();
            }, 500)
            // console.log(this.response);
        })
        req.send()
    };
}

function reload() {
    // console.log(this.response);
    location.reload()
}

const BtnRead = new tito('.btn-read')
for (var i of BtnRead.selector) {
    rec = i.getAttribute('rec');
    if (i && rec) {
        i.hidden = false;
    }
}
BtnRead.bind('click', function (e) {
    e.preventDefault();
    var modalBody = document.getElementById('modal-body');
    modalTitle = document.getElementById('modal-title');
    modalTitle.textContent = 'Reader';
    modalBody.innerHTML = '';
    IFRAME = document.createElement("IFRAME")
    IFRAME.setAttribute('width', '100%')
    IFRAME.setAttribute('height', (window.innerHeight - 220) + 'px')
    if (this.getAttribute('reader') == 'ms') {
        url = '//view.officeapps.live.com/op/embed.aspx?src=' + window.location.origin + this.getAttribute('target') + '?v=' + (new Date()).getTime();
    } else {
        url = '//docs.google.com/gview?&embedded=true&url=' + window.location.origin + this.getAttribute('target') + '?v=' + (new Date()).getTime();
    }
    IFRAME.src = url
    modalBody.appendChild(IFRAME);
    myModal.show()
})

btnCheckout = new tito('.btn-modal-checkout')
btnCheckout.bind('click', function () {
    const req = new ajax(this.getAttribute('href'), 'get', '', function () {
        fees = JSON.parse(this.response);
        var modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = ''
        modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = 'Invoice';
        card = document.createElement('div')
        card.setAttribute('class', 'card')
        modalBody.appendChild(card);
        if (fees.status == 'error') {
            return modalBody.innerHTML = '<p class="text-danger">' + fees.message + '</p>';        
        }
        for (var i in fees.bill) {
            const row = document.createElement('div');
            row.setAttribute('class', ' row g-0');
            card.appendChild(row);
            col1 = document.createElement('div');
            col1.setAttribute('class', 'col-md-6')
            row.appendChild(col1);
            body1 = document.createElement('div')
            body1.setAttribute('class', 'card-body');
            col1.appendChild(body1);
            body1.innerHTML = '<p>' + i.replace(/_/g, ' ') + '</p>';

            col2 = document.createElement('div');
            col2.setAttribute('class', 'col-md-6')
            row.appendChild(col2);
            body2 = document.createElement('div')
            body2.setAttribute('class', 'card-body');
            col2.appendChild(body2);


            if (fees.nationality == 'domestic') {
                body2.innerHTML = '<p class="text-end">' + (new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(fees.bill[i])) + '</p>';
            } else {
                body2.innerHTML = '<p class="text-end">' + (new Intl.NumberFormat('us-EN', { style: 'currency', currency: 'USD' }).format(fees.bill[i])) + '</p>';
            }
        }

        hr = document.createElement('hr');
        modalBody.appendChild(hr)

        const row = document.createElement('div');
        row.setAttribute('class', ' row g-0');
        card.appendChild(row);
        col1 = document.createElement('div');
        col1.setAttribute('class', 'col-md-6')
        row.appendChild(col1);
        body1 = document.createElement('div')
        body1.setAttribute('class', 'card-body');
        col1.appendChild(body1);
        body1.innerHTML = '<b>Total</b>';

        col2 = document.createElement('div');
        col2.setAttribute('class', 'col-md-6')
        row.appendChild(col2);
        body2 = document.createElement('div')
        body2.setAttribute('class', 'card-body text-end');
        col2.appendChild(body2);



        if (fees.nationality == 'domestic') {
            body2.innerHTML = '<b>' + (new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(fees.bill.Total)) + '</b>';
        } else {
            body2.innerHTML = '<b>' + (new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(fees.bill.Total)) + '</b>';
        }

        btnBill = document.createElement('button')
        modalBody.appendChild(btnBill)
        btnBill.setAttribute('class', 'btn btn-info btn-send-bill')
        btnBill.textContent = 'Send Me Bill';
    })
    req.send()
})

const btnSearch = new tito('#btn-search');
btnSearch.bind('click', finding)
const keywordFind = new tito('#keyword-find');

function finding(e) {
    const textSearch = keywordFind.selector[0].value.trim();
    const href = window.location.href.replace(/index.php\//, '').split('/');
    e.preventDefault();
    href[6] = textSearch
    location.href = href.join('/');
}

keywordFind.bind('blur', finding)

keywordFind.bind('keyup', function (e) {
    if (e.key == 'Enter') finding(e)
})
const upload = new tito('.upload-img');
upload.bind('click', function () {
    const target = new tito(this.getAttribute('target'));
    window.selectImage = this;
    target.selector[0].click();
    window.loaderGif = this.parentNode.children[2]
})

const selectorImg = new tito('.selector-img');
selectorImg.bind('change', function () {
    window.loaderGif.hidden = false;
    window.selectImage.hidden = true;
    addImage(this, window.selectImage)
})

function addImage(e, img) {
    const imgFile = e.files[0]
    if (imgFile) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var temp = document.createElement("img");
            temp.onload = function (event) {
                const width = this.width;
                const height = this.height;
                const ratio = height / width;
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(temp, 0, 0, newWidth, newHeight);
                var dataurl = canvas.toDataURL(imgFile.type);
            }
            const req = new ajax(img.src, 'post', { data: e.target.result }, function () {
                console.log(this.response)
                setTimeout(function () {
                    window.loaderGif.hidden = true;
                    img.hidden = false;
                    img.src = img.src + '?v=' + (new Date());
                }, 500)
            })
            req.send()
        }
    }
    reader.readAsDataURL(imgFile);
}

btnJoinTelegram = new tito('#join-telegram')
btnJoinTelegram.bind('click', function () {
    tg = new tito('.telegram-link')
    tg.selector[0].hidden = false;
})

const btnDelete = new tito('.btn-delete');
const confirmMessage = new tito('#modal-body-confirm').selector[0] 
btnDelete.bind('click', confirmation)
function confirmation() {
    confirmMessage.hidden = false;
    modalSelectTitle.selector[0].innerHTML = 'Confirmation'
    confirmMessage.children[0].innerHTML = '<p>All data will be deleted and there will be <b>no refund</b> if it has been transferred.<p>'; 
    window.data = 'deleted';
    window.target = '/member/register/delete/'
}
const btnCancel = new tito('.btn-cancel');
btnCancel.bind('click', function (e) {
    e.preventDefault();
})

if (editTable.selector.length > 0) {
    for (var i of editTable.selector) {
        i.setAttribute('title', window.title[i.getAttribute('class').split(' ')[0]])
        i.setAttribute('placeholder', window.title[i.getAttribute('class').split(' ')[0]])
    }
}
/* editTable.bind('blur', function () {
        if (this.textContent=='') {
            this.setAttribute('placeholder', window.title[this.getAttribute('class').split(' ')[0]])
        }

        blur(this)
    }

) */
