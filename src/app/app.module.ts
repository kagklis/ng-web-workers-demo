import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { CalculationComponent } from './calculation/calculation.component';
import { HomeComponent } from './home/home.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      CalculationComponent,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      NgbModule,
      FormsModule
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
