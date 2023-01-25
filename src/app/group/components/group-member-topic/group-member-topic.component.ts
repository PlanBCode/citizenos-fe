import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { GroupMemberTopicService } from 'src/app/services/group-member-topic.service';
import { TopicService } from 'src/app/services/topic.service';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { Topic } from 'src/app/interfaces/topic';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'group-member-topic',
  templateUrl: './group-member-topic.component.html',
  styleUrls: ['./group-member-topic.component.scss']
})
export class GroupMemberTopicComponent implements OnInit {

  @Input() memberTopic?: any;
  @Input() canUpdate?: any;
  @Input() group?: Group;
  @Input() fields?: any;

  wWidth = window.innerWidth;
  constructor(private dialog: MatDialog, public GroupMemberTopic: GroupMemberTopicService, public TopicService: TopicService, public GroupService: GroupService) { }

  ngOnInit(): void {
  }

  isVisibleField(field: string) {
    return this.fields?.indexOf(field) > -1
  }

  doUpdateMemberTopic(level: string) {
    const memberTopic = this.memberTopic;
    const group = this.group;
    if (memberTopic && memberTopic?.permission.levelGroup !== level) {
      const oldLevel = memberTopic?.permission.levelGroup;
      memberTopic.permission.levelGroup = level;
      memberTopic['level'] = level;
      this.GroupMemberTopic
        .update({ groupId: group?.id, topicId: memberTopic.id }, memberTopic)
        .pipe(
          take(1)
        ).subscribe((res) => {
          memberTopic.permission.levelGroup = oldLevel;
        })
    }
  }
  doDeleteMemberTopic() {

    const deleteDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        heading: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_HEADING',
        title: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_HEADING',
        points: ['MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_TXT_ARE_YOU_SURE'],
        confirmBtn: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_BTN_YES',
        closeBtn: 'MODALS.GROUP_MEMBER_TOPIC_DELETE_CONFIRM_BTN_NO'
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.GroupMemberTopic
          .delete({
            topicId: this.memberTopic.id,
            groupId: this.group?.id
          }).pipe(take(1)).subscribe((res) => {
            console.log(res);
            //this.GroupMemberTopicService.reload();
          })
      }
    });
  };
}
