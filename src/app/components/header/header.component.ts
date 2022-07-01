import { Router } from '@angular/router';
import { AfterContentChecked, AfterViewChecked, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, DoCheck {

  isLogged!: boolean;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private route: Router,
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

  logout() {
    if (this.isLogged) {
      this.spinner.show()
      setTimeout(() => {
        this.cookie.delete('auth.token', '/')
        this.spinner.hide()
        this.route.navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.route.navigate(['/']))
      }, 2000)
    }
  }
}
