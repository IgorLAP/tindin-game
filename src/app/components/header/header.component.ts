import { Router } from '@angular/router';
import { Component, DoCheck, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, DoCheck {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>
  isLogged!: boolean;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.isLogged = this.authService.isLogged
  }

  ngOnInit(): void {

  }

  ngDoCheck(): void {
    if (this.isLogged !== this.authService.isLogged) {
      this.isLogged = this.authService.isLogged
    }
  }

  handleSearch() {
    const query = this.searchInput.nativeElement.value
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  logout() {
    if (this.isLogged) {
      this.spinner.show()
      setTimeout(() => {
        this.cookie.delete('auth.token', '/')
        this.spinner.hide()
        this.router.navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/']))
      }, 2000)
    }
  }
}
