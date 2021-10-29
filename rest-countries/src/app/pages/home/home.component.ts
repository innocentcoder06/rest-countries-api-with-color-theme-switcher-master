import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private rest: RestService) { 
    this.currentRegion = 'all';
    this.scrollDiv = false;
    this.currentPos = 0;
    this.switchBool = false;
  }
  resData: any = [];
  scrollDiv: boolean;
  currentPos: number;
  switchBool: boolean;
  themeData = [
    {
      nav_bg: 'hsl(0, 0%, 100%)',
      content_bg: 'hsl(0, 0%, 98%)',
      text: 'hsl(200, 15%, 8%)',
      loader_bg: 'rgba(34, 34, 34, 0.25)',
      loader_top: 'rgba(34, 34, 34, 0.75)'
    },
    {
      nav_bg: 'hsl(209, 23%, 22%)',
      content_bg: 'hsl(207, 26%, 17%)',
      text: 'hsl(0, 0%, 100%)',
      loader_bg: 'rgba(255, 255, 255, 0.25)',
      loader_top: 'rgba(255, 255, 255, 0.75)'
    }
  ];

  search = new FormControl();
  currentRegion: string;

  @ViewChild('fbox', { static: false })
  filterTrigger!: ElementRef;

  @ViewChild('flist', { static: false })
  filterList!: ElementRef;

  @ViewChild('dataDiv', { static: false })
  dataDiv!: ElementRef;

  ngOnInit(): void {
    this.fetchCountries();
    if (localStorage.getItem('themePref') !== null) {
      let themeD: any = localStorage.getItem('themePref');
      themeD = JSON.parse(themeD?themeD:'{}');
      if (localStorage.getItem('themeBool') !== null) {
        let val = localStorage.getItem('themeBool');
        this.switchBool = val === 'true'? true: false;
      } else {
        return;
      }
      document.documentElement.style.setProperty('--nav-bg', themeD.nav_bg);
      document.documentElement.style.setProperty('--content-bg', themeD.content_bg);
      document.documentElement.style.setProperty('--text', themeD.text);
      document.documentElement.style.setProperty('--loader-bg', themeD.loader_bg);
      document.documentElement.style.setProperty('--loader-top', themeD.loader_top);
    }
  }


  
  changeTheme(cBox: boolean) {
    if (!cBox) {
      document.documentElement.style.setProperty('--nav-bg', this.themeData[0].nav_bg);
      document.documentElement.style.setProperty('--content-bg', this.themeData[0].content_bg);
      document.documentElement.style.setProperty('--text', this.themeData[0].text);
      document.documentElement.style.setProperty('--loader-bg', this.themeData[0].loader_bg);
      document.documentElement.style.setProperty('--loader-top', this.themeData[0].loader_top);
      localStorage.setItem('themePref', JSON.stringify(this.themeData[0]));
      localStorage.setItem('themeBool', 'false');
    } else {
      document.documentElement.style.setProperty('--nav-bg', this.themeData[1].nav_bg);
      document.documentElement.style.setProperty('--content-bg', this.themeData[1].content_bg);
      document.documentElement.style.setProperty('--text', this.themeData[1].text);
      document.documentElement.style.setProperty('--loader-bg', this.themeData[1].loader_bg);
      document.documentElement.style.setProperty('--loader-top', this.themeData[1].loader_top);
      localStorage.setItem('themePref', JSON.stringify(this.themeData[1]));
      localStorage.setItem('themeBool', 'true');
    }
  }
  
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    document.addEventListener('scroll', () => {
      if (window.scrollY > 0 && window.scrollY > this.currentPos) {
        this.scrollDiv = true;
        this.currentPos = window.scrollY;
      } else {
        this.scrollDiv = false;
        this.currentPos = window.scrollY;
      }
    });
  }  

  filterClick() {
    if (this.filterTrigger.nativeElement.classList.contains('expand')) {
      this.filterTrigger.nativeElement.classList.remove('expand');
      this.filterList.nativeElement.style.setProperty('display', 'none');
    } else {
      this.filterTrigger.nativeElement.classList.add('expand');
      this.filterList.nativeElement.style.setProperty('display', 'flex');
    }
  }

  fetchCountries() {
    this.rest.getAll().subscribe((res: any) => {
      this.resData = res;
    });
  }

  formatNumber(num: number) {
    return Intl.NumberFormat().format(num);
  }

  filterByregion(region: string) {
    if(this.currentRegion === region) {
      this.resData = this.rest.getOrgData();
      this.currentRegion = 'all';
    } else {
      this.rest.filterByRegion(region).subscribe((res: any) => {
        this.resData = res;
        this.currentRegion = region;
      });
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.rest.searchByName(this.search.value).subscribe((res: any) => {
        this.resData = res;
      });
    } else if (this.search.value === null || this.search.value === '') {
      this.resData = this.rest.getOrgData();
    }
  }

  backToTop() {
    this.scrollDiv = false;
    this.currentPos = 0;
    window.scrollTo(0, 0);
  }


}
