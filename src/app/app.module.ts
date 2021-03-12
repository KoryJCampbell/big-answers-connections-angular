import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GraphComponent } from './graph/graph.component';
import { LoginComponent } from './login/login.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { NgxCsvParserModule } from 'ngx-csv-parser';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GraphComponent
  ],
  imports: [
    AngularMaterialModule,
    BrowserAnimationsModule,
    NgxDropzoneModule,
    FlexLayoutModule,
    AppRoutingModule,
    NgxStickySidebarModule,
    NgxCsvParserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
