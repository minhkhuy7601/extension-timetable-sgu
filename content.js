


const listenMessage = ()=>{
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request.sign === 1) {
                getSubject(request.value)
                sendResponse(1);
            }
            if (request.sign === 2) {;
                // sendResponse(getNameTeacher());
                sendResponse(addDataToObj());
            }
        }
    );
}

listenMessage();


const getSubject = idSubject => {
    let a = document.querySelector('#txtMaMH1');
    let btn = document.querySelector('#btnLocTheoMaMH1');
    a.value = idSubject;
    btn.click();
}

const addDataToObj = () => {
    let table = document.querySelector('#pnlDSMonhocDK');
    let titleTable = table.querySelectorAll('.title-table td');
    let row = table.querySelectorAll('.body-table');
    let array = [];
    let maMH;
    
    row.forEach((value, index) => {
        let json = {};
        let item = value.querySelectorAll('td');
        maMH = item[1].textContent;
        item.forEach((val, ind) => {
            let title = xoa_dau(titleTable[ind].textContent);
            // console.log(val);
            let detail = val.querySelectorAll('.top-fline');
            let temp = [];
            if (detail.length) {
                detail.forEach((v, i) => {
                    temp.push(xoa_dau(v.textContent));
                })
                json[title] = temp;
            } else {
                json[title] = val.textContent;
            }
        })
        array.push(json);

    })
    console.log(array)
    return {maMH, array};
}


function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\s/g, '');

    return str;
}