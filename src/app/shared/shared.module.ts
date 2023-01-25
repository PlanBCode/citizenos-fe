import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicboxComponent } from '../public-topics/components/topicbox/topicbox.component';
import { PublicgroupboxComponent } from '../public-groups/components/publicgroupbox/publicgroupbox.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '../directives/tooltip';
import { CosDropdownDirective } from '../directives/cos-dropdown.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { TypeaheadComponent, TypeaheadItem } from './components/typeahead/typeahead.component';
import { FormsModule } from '@angular/forms';
import { CosInitialsComponent } from './components/cos-initials/cos-initials.component';
import { MomentModule } from 'ngx-moment';
import { QRCodeModule } from 'angularx-qrcode';
import { CosPaginationComponent } from './components/cos-pagination/cos-pagination.component';
import { SocialshareDirective } from '../directives/socialshare.directive';
import { ActivityComponent } from './components/activity/activity.component';
import { CosToggleComponent } from './components/cos-toggle/cos-toggle.component';
import { TopicMemberUserComponent } from '../topic/components/topic-member-user/topic-member-user.component';
import { TopicMemberGroupComponent } from '../topic/components/topic-member-group/topic-member-group.component';
@NgModule({
  declarations: [
    ActivityComponent,
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosInitialsComponent,
    CosPaginationComponent,
    CosToggleComponent,
    PublicgroupboxComponent,
    SocialshareDirective,
    TooltipDirective,
    TopicMemberUserComponent,
    TopicMemberGroupComponent,
    TopicboxComponent,
    TypeaheadComponent,
    TypeaheadItem,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MomentModule,
    QRCodeModule,
    TranslateModule,
  ],
   exports: [
    ActivityComponent,
    ConfirmDialogComponent,
    CosDropdownDirective,
    CosInitialsComponent,
    CosPaginationComponent,
    CosToggleComponent,
    MatDialogModule,
    MomentModule,
    PublicgroupboxComponent,
    QRCodeModule,
    SocialshareDirective,
    TooltipDirective,
    TopicboxComponent,
    TopicMemberUserComponent,
    TopicMemberGroupComponent,
    TypeaheadComponent,
    TypeaheadItem
   ]
})
export class SharedModule { }
