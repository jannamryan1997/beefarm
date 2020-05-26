import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundView } from './not-found.view';

const notFoundRoutes: Routes = [
    { path: '', component: NotFoundView }
];
@NgModule({
    imports: [RouterModule.forChild(notFoundRoutes)],
    exports: [RouterModule]
})

export class NotFoundRoutingModule { }