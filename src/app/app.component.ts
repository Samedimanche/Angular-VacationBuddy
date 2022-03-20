import { Component, OnInit, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Counrty {
  countryCode: string;
  name: string;
}
export class Border {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: null;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.getCountries();
  }

  constructor(public http: HttpClient) {}

  countries: Counrty[] = [];
  public full_contri: string[] = [];
  tempdatas: string[] = [];
  hidden = true; //选择框是否隐藏
  searchField = ''; //文本框数据
  c_selected = '';

  getCountries() {
    this.http
      .get<any>('https://date.nager.at/api/v3/AvailableCountries')
      .subscribe((data) => {
        this.countries = data;
      });

    for (let i = 0; i < this.countries.length; i++) {
      this.full_contri[i] =
        this.countries[i].name + '(' + this.countries[i].countryCode + ')';
      // console.log(this.full_contri[i]);
    }
    this.tempdatas = this.full_contri; //下拉框选项副本
    this.hidden = !this.hidden;
    console.log(this.hidden);
  }

  //将下拉选的数据值赋值给文本框
  change(c_selected: string) {
    this.searchField = c_selected;
    this.hidden = false;
  }
  //获取的数据值与下拉选逐个比较，如果包含则放在临时变量副本，并用临时变量副本替换下拉选原先的数值，如果数据为空或找不到，就用初始下拉选项副本替换
  changeKeyValue(c_input: string) {
    var newDate: string[] = []; //临时下拉选副本
    //如果包含就添加
    this.full_contri.forEach((val, index, array) => {
      if (val.indexOf(c_input) >= 0) {
        newDate.unshift(val);
        // console.log(val);
      }
    });
    //用下拉选副本替换原来的数据
    this.full_contri = newDate;
    //下拉选展示
    this.hidden = true;
    //如果不包含或者输入的是空字符串则用初始变量副本做替换
    if (this.full_contri.length == 0 || '' == c_input) {
      this.full_contri = this.tempdatas;
    }
  }

  year = 2022;
  changeYear() {
    if (this.year > 2122) this.year = 2122;
    if (this.year < 1922) this.year = 1922;
  }

  B_CT: Border[] = [];
  holidays: number[] = [];
  // searchNeighbour(): Search Neighbors and count their holiday numbers separately
  // Results: B_CT, holidays.
  searchNeighbour() {
    // get border countries data
    var temps: String = this.c_selected.toString();
    var api =
      'https://date.nager.at/api/v3/CountryInfo/' +
      temps.substr(temps.length - 3, 2);

    this.http.get<any>(api).subscribe((data) => {
      this.B_CT = data.borders;

      var bd_api =
        'https://date.nager.at/api/v3/PublicHolidays/' + this.year + '/';
      for (let j = 0; j < this.B_CT.length; j++) {
        // to get holiday number
        this.http
          .get<any>(bd_api + this.B_CT[j].countryCode)
          .subscribe((result) => {
            this.holidays.push(result.length);
            // console.log(this.holidays);
          });
      }
    });
  }
}
