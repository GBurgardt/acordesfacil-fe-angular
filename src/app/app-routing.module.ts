import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TabComponent } from './components/tab/tab.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: ':href',
        component: TabComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
