import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './pages/side-menu/side-menu.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChatWindowComponent } from './pages/chat-window/chat-window.component';
import { MessageComponent } from './pages/message/message.component';
import { MessageInputComponent } from './pages/message-input/message-input.component';
import { ChatService } from './chat.service';
import { SocketIoModule } from 'ngx-socket-io';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    SideMenuComponent,
    ProfileComponent,
    ChatsComponent,
    BookmarksComponent,
    NotificationsComponent,
    SettingsComponent,
    ChatWindowComponent,
    MessageComponent,
    MessageInputComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // SocketIoModule.forRoot({ url: 'http://localhost:3000', options: {} })
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
