import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthGuard } from './auth.guard';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
    // component:DashboardComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: LayoutComponent,
        children: [
          { path: 'profile', component: ProfileComponent },
          { path: 'chats', component: ChatsComponent },
          { path: 'bookmarks', component: BookmarksComponent },
          { path: 'notifications', component: NotificationsComponent },
          { path: 'settings', component: SettingsComponent }
        ]
      }
    ]
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
