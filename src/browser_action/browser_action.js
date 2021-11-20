let buttonBox = document.querySelector("#button-box");
let inputSide = document.querySelector("#input-side .loading-box");
let btnRender = document.querySelector("#btn-render");
let listTeacher = document.querySelector("#list-teacher");
let middleSection = document.querySelector("#middle-section");
let btnSeeMore = document.querySelector("#btn-see-more");

let root;
let store = new Array();
let arrayMainCampus = new Array();
let arrayMainCampusTemp = new Array();
let listSubject = new Array();
let ArrayTTB = new Array();

let templeTimetable = new Array();
for (let i = 0; i < 7; i++) {
  templeTimetable[i] = new Array();
  for (let j = 0; j < 10; j++) {
    templeTimetable[i][j] = null;
  }
}

const handleChange = () => {
  const btnSub = document.querySelector("#btn-sub");
  const input = document.querySelector("#input-data");
  let form = document.querySelector(".form");

  form.addEventListener("submit", (e) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { sign: 1, value: input.value },
        (response) => {
          if (response === 1) {
            request(input.value);
          }
        }
      );
    });
    e.preventDefault();
  });
};

const init = () => {
  // chrome.storage.local.set({'data': null});
  chrome.storage.local.get('data', result => {
    if(result.data){
      let data = result.data;
      console.log(data)
      store = data.store;
      listSubject = data.listSubject;
      renderListSide();
    }
    // if (result.data) {
      //     rootData = result.data;
      //     arrayMainCampus = rootData.arrayMainCampus
      //     listSubject = rootData.listSubject
      //     renderListSide();
      //     renderTimetables();
      // }
  });
  handleChange();
  calculate();
};
init();

function main(data) {
  showListGroup(data);
  addToList(data);
}

const request = (value) => {
  let start = new Date();
  const interval = setInterval(() => {
    inputSide.innerHTML = `<img id="loading-icon" style="width: 50%; margin-left: 70px;" src="../../icons/loading.gif" alt="">`;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs1) {
      chrome.tabs.sendMessage(tabs1[0].id, { sign: 2 }, (res) => {
        const { maMH, ...data } = res;
        if (maMH === value) {
          inputSide.innerHTML = "";
          clearInterval(interval);
          main(data.array);
        }
      });
    });
    let end = new Date();
    if (end - start > 5000) {
      inputSide.innerHTML =
        '<p style="font-size: 25px;font-weight: bold; color: red; text-align: center" >Không tìm thấy thông tin, vui lòng kiểm tra mã môn học! </p>';
      clearInterval(interval);
    }
  }, 500);
};

const analyzeData = (value, useTemplateTTB) => {
  let tmp;
  let check = true;
  let checkCampus = true;
  let { Thu, ST, TietBD } = value;
  Thu.forEach((val1, ind1) => {
    switch (val1) {
      case "Hai": {
        tmp = 0;
        break;
      }
      case "Ba": {
        tmp = 1;
        break;
      }
      case "Tu": {
        tmp = 2;
        break;
      }
      case "Nam": {
        tmp = 3;
        break;
      }
      case "Sau": {
        tmp = 4;
        break;
      }
      case "Bay": {
        tmp = 5;
        break;
      }
      case "CN": {
        tmp = 6;
        break;
      }
    }
    for (let z = 0; z < parseInt(ST[ind1]); z++) {
      if (useTemplateTTB[tmp][parseInt(TietBD[ind1]) + z - 1] == null) {
        let ST;
        let Tenmonhoc;
        let Phong;
        let MaMH;
        let NMH;
        let Giangvien;
        let CL;
        z == 0 ? (ST = value.ST[ind1]) : (ST = 0);

        Tenmonhoc = value.Tenmonhoc;
        Phong = value.Phong[ind1];
        MaMH = value.MaMH;
        NMH = value.NMH;
        CL = value.CL;
        Giangvien = value.Giangvien[ind1];
        let obj = { ST, Tenmonhoc, Phong, MaMH, NMH, Giangvien };
        // if (Phong.charAt(0) !== "C") {
        //   checkCampus = false;
        // }
        // if(!+CL){
        //   checkCampus = false;
        // }

        useTemplateTTB[tmp][parseInt(TietBD[ind1]) + z - 1] = obj;
      } else {
        check = false;
        break;
      }
      if (!check) {
        break;
      }
    }
  });

  if (check) {
    if (checkCampus) {
      arrayMainCampusTemp.push(useTemplateTTB);
    }
  }
};

const handleMain = () => {
  arrayMainCampusTemp = [];
  arrayMainCampus = [];
  console.log(store);
  store.forEach((valueStore, index)=>{
    if (index === 0) {
      for (let i = 0; i < valueStore.length; i++) {
        let useTemplateTTB = JSON.parse(JSON.stringify(templeTimetable));
        analyzeData(valueStore[i], useTemplateTTB);
      }
    } else {
      arrayMainCampus.forEach((val, ind) => {
        for (let i = 0; i < valueStore.length; i++) {
          let valueClone = JSON.parse(JSON.stringify(val));
          analyzeData(valueStore[i], valueClone);
        }
      });
    }
    arrayMainCampus = [...arrayMainCampusTemp];
    arrayMainCampusTemp = [];
  })
  
  ArrayTTB = [];
  arrayMainCampus.forEach((value, index) => {
    let TKB = value;
    let pointTKB = 0;
    TKB.forEach((val, ind) => {
      let point = 0;
      let s = 1;
      for (let i = 0; i < 9; i++) {
        if (val[i] === null && val[i + 1] === null) {
          point += s;
          s++;
        } else {
          s = 1;
        }
      }
      pointTKB += point;
    });

    ArrayTTB.push({ data: value, point: pointTKB, index });
  });
  ArrayTTB.sort((a, b) => {
    if (a.point > b.point) {
      return -1;
    }
    if (a.point < b.point) {
      return 1;
    }
    return 0;
  });
  console.log(ArrayTTB)

};

const showListGroup = (data) => {
  let listTeacher = document.querySelector("#list-teacher");
  let teachers = [];

  listTeacher.innerHTML = "";
  data.forEach((value, index) => {
    teachers.push(value.NMH);
  });
  listTeacher.innerHTML = `<li>
    <input type="checkbox" value="all" id="all">
    <label for="all">Tất cả</label>
    </li>`;
  teachers.forEach((value, index) => {
    listTeacher.innerHTML += `
                <li>
                    <input type="checkbox" value="${value}" id="${index}">
                    <label for="${index}">Nhóm - ${value}</label>
                </li>`;
  });
  listTeacher.innerHTML += `<button id="btn-add-list" type="button" class="btn btn--success">Thêm</button>`;
};

const addToList = (data) => {
  let checkbox = document.querySelectorAll(
    "#list-teacher input[type=checkbox]"
  );
  let btnAdd = document.querySelector("#btn-add-list");
  let MaMH = data[0]["MaMH"];
  let Tenmonhoc = data[0]["Tenmonhoc"];
  let nhomMonHoc = [];
  let selected = false;

  btnAdd.addEventListener("click", () => {
    let checkboxAll = false;
    let dataRaw = new Array();

    //inspect checkbox ALL
    if (checkbox[0].checked) {
      dataRaw = [...data];
      data.forEach((val) => {
        let { NMH } = val;
        nhomMonHoc.push(NMH);
      });
      checkboxAll = true;
      selected = true;
    }

    if (!checkboxAll) {
      checkbox.forEach((val, ind) => {
        if (val.checked) {
          nhomMonHoc.push(val.value);
          dataRaw.push(data[ind - 1]);
          selected = true;
        }
      });
    }

    if (selected) {
      let subject = { MaMH, Tenmonhoc, nhomMonHoc };
      listSubject.push(subject);
      listTeacher.innerHTML = "";
      console.log(listSubject);
      // handleMain();
      // renderTimetables();
      //   handleCheckbox();
    } else {
      alert("Vui lòng chọn thông tin giáo viên");
    }
    renderListSide();
    store.push(dataRaw)
    
    chrome.storage.local.set({'data': {store, listSubject}});
    middleSection.innerHTML = '';
    btnSeeMore.innerHTML = ''
    // console.log(store)
    // calculate();
  });
};

const renderListSide = () => {
  let side = document.querySelector("#top-section #list-side .table-side");
  let title = document.querySelector("#top-section #list-side h2");
  side.innerHTML = ``;
  if (listSubject.length) {
    title.innerHTML = `Danh sách có ${listSubject.length} môn học`;
  }
  listSubject.forEach(function (val, ind) {
    let maNhomMonHoc = "";
    val["nhomMonHoc"].forEach((v) => {
      maNhomMonHoc += `<span>${v}</span>`;
    });
    side.innerHTML += `
              <ul class="item-subject">
                    <li class="item-suject--index">${ind + 1}</li>
                    <li class="item-suject--name">${val["Tenmonhoc"]}</li>
                    <li class="item-suject--idGroup">${maNhomMonHoc}</li>
                    <li class="item-suject--button">&#10008;</li>
                </ul>
        `;
  });
  removeItem()
};

function removeItem(){
  let btnDel = document.querySelector('#btn-del');
  let btnRemoveItems = document.querySelectorAll('.item-suject--button');

  btnDel.addEventListener('click',()=>{
    listSubject = [];
    store = [];
    chrome.storage.local.set({'data': {store, listSubject}});
    renderListSide();
  })

  btnRemoveItems.forEach((val,index)=>{
    val.addEventListener('click', ()=>{
      listSubject.splice(index, 1);
      store.splice(index, 1);
      chrome.storage.local.set({'data': {store, listSubject}});
      renderListSide();
    })
  })
}

function calculate() {
  btnRender.addEventListener("click", () => {
    handleMain();
    if(renderTimetables(0)){
      seeMore()
    };
  });
}

function timetable(start, end) {
  for (let z = start; z < end; z++) {
    console.log(z)
    if(z>=ArrayTTB.length){
      return false;
    }
    let val = ArrayTTB[z].data;
    let string = "";
    for (let i = 0; i < 10; i++) {
      string += `<tr><td class="tiet">Tiết ${i + 1}</td>`;
      for (let j = 0; j < 6; j++) {
        if (val[j][i] == null) {
          string += `<td></td>`;
        } else {
          if (val[j][i].ST != 0)
            string += `<td class="active" rowspan="${val[j][i].ST}"><span style="color: #341f97">${val[j][i].MaMH}</span><br>${val[j][i].Tenmonhoc}<br><span>Phong:${val[j][i].Phong}</span>
            <br><span style="color: black">${val[j][i].Giangvien}</span><br><span style="color: red">Nhóm - ${val[j][i].NMH}</span>
            </td>`;
        }
      }
      string += `</tr>`;
    }
    middleSection.innerHTML += `<div class="component-timetable">

      <div class="timetable">
          <h3>Thời khóa biểu ${z + 1} </h3>
          <table>
              <thead>
                  <tr>
                      <td></td>
                      <td>thứ hai</td>
                      <td>thứ ba</td>
                      <td>thứ tư</td>
                      <td>thứ năm</td>
                      <td>thứ sáu</td>
                      <td>thứ bảy</td>
                  </tr>
              </thead>
              <tbody>
                  ${string}


              </tbody>
          </table>
      </div>
  </div>`;
  }
  return true;

}
function renderTimetables(start) {
  if(!timetable(start, start+10)){
    btnSeeMore.innerHTML = ``;
    return false;
  }
  return true;
  
}



function seeMore(){
  let a = 10;
  btnSeeMore.innerHTML = `<button>Xem thêm</button>`;
  let btn = btnSeeMore.querySelector('button');
  btn.addEventListener('click',()=>{
    renderTimetables(a)
    a+=10;
  })
}
