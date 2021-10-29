import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private rest: RestService, private route: Router) { 
    this.scrollDiv = false;
    this.currentPos = 0;
    if (this.rest.hasData()) {
      this.fetchCountry();
    } else {
      route.navigateByUrl('');
    }
  }

  fetchCountry() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.rest.searchByName(params.name).subscribe((res: any) => {
        this.countryData = res[0];
      });
    });
  }

  

  formatNumber(num: number) {
    return Intl.NumberFormat().format(num);
  }

  getNativeName(name: any) {
    let native: any = Object.values(name).pop();
    return native.common;
  }

  getCurrency(curr: any) {
    let currency: any = Object.values(curr).pop();
    return currency.name;
  }

  getLang(lang: any) {
    return Object.values(lang).sort().toString()
  }

  getCountry(key: string) {
    return this.rest.getFullName(key);
  }

  scrollDiv: boolean;
  countryData: any;
  currentPos: number;

  @ViewChild('fbox', { static: false })
  filterTrigger!: ElementRef;

  @ViewChild('flist', { static: false })
  filterList!: ElementRef;

  @ViewChild('dataDiv', { static: false })
  dataDiv!: ElementRef;

  themeData = [
    {
      nav_bg: 'hsl(0, 0%, 100%)',
      content_bg: 'hsl(0, 0%, 98%)',
      text: 'hsl(200, 15%, 8%)'
    },
    {
      nav_bg: 'hsl(209, 23%, 22%)',
      content_bg: 'hsl(207, 26%, 17%)',
      text: 'hsl(0, 0%, 100%)'
    }
  ];


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }

  changeTheme(cBox: boolean) {
    if (!cBox) {
      document.documentElement.style.setProperty('--nav-bg', this.themeData[0].nav_bg);
      document.documentElement.style.setProperty('--content-bg', this.themeData[0].content_bg);
      document.documentElement.style.setProperty('--text', this.themeData[0].text);
    } else {
      document.documentElement.style.setProperty('--nav-bg', this.themeData[1].nav_bg);
      document.documentElement.style.setProperty('--content-bg', this.themeData[1].content_bg);
      document.documentElement.style.setProperty('--text', this.themeData[1].text);
    }
  }

  backToTop() {
    this.scrollDiv = false;
    this.currentPos = 0;
    window.scrollTo(0, 0);
  }

}
