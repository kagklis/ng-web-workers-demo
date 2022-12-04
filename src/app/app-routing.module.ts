import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculationComponent } from './calculation/calculation.component';
import { ChartComponent } from './chart/chart.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
   {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
   },
   {
      path: 'home',
      component: HomeComponent,
   },
   {
      path: 'calculation',
      component: CalculationComponent,
   },
   {
      path: 'chart',
      component: ChartComponent,
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule {}
