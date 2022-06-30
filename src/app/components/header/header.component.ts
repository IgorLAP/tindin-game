import { AfterContentChecked, AfterViewChecked, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, DoCheck {

  isLogged!: boolean;

  constructor(private authService: AuthService) {
    this.isLogged = this.authService.isLogged
  }

  ngOnInit(): void {

  }

  ngDoCheck(): void {
    if (this.isLogged !== this.authService.isLogged) {
      this.isLogged = this.authService.isLogged
    }
  }
}
