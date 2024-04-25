import { TopicService } from 'src/app/services/topic.service';
import { AfterViewInit, Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, exhaustMap, map, of, shareReplay, switchMap, take } from 'rxjs';
import { Idea } from 'src/app/interfaces/idea';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { LocationService } from 'src/app/services/location.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TopicIdeaService } from 'src/app/services/topic-idea.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DialogService } from 'src/app/shared/dialog';
import { IdeaReportComponent } from '../idea-report/idea-report.component';
import { AddIdeaFolderComponent } from '../add-idea-folder/add-idea-folder.component';
import { IdeaReportReasonComponent } from '../idea-report-reason/idea-report-reason.component';
import { Topic } from 'src/app/interfaces/topic';

@Component({
  selector: 'ideabox',
  templateUrl: './ideabox.component.html',
  styleUrls: ['./ideabox.component.scss']
})
export class IdeaboxComponent implements AfterViewInit {
  @Input() idea!: Idea; // decorate the property with @Input()
  showDeletedIdea = false;
  @Input() topic!: Topic;
  @Input() ideationId!: string;
  @Input() showReplies?: boolean = false;
  showEdit = false;
  showEdits = false;
  showReply = false;
  readMore = false;
  mobileActions = false;
  isReply = false;
  errors = [];
  wWidth = window.innerWidth;
  private loadVotes$ = new BehaviorSubject<void>(undefined);
  constructor(
    public dialog: DialogService,
    public config: ConfigService,
    public router: Router,
    public Auth: AuthService,
    private Location: LocationService,
    private Notification: NotificationService,
    public Translate: TranslateService,
    private TopicService: TopicService,
    public TopicIdeaService: TopicIdeaService
  ) {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  canEditTopic() {
    return this.TopicService.canEdit(this.topic);
  }
  canEditIdea() {
    return (this.idea.author.id === this.Auth.user.value.id && !this.idea.deletedAt);
  };

  goToView($event: any) {
    const routerLink=['/','topics', this.topic.id, 'ideation', this.ideationId, 'ideas', this.idea.id ];
    this.router.navigate(routerLink);
  }


  isEdited() {
    return this.idea.edits?.length > 1;
  };

  isVisible() {
    return (!this.idea.deletedAt && !this.showDeletedIdea) || (this.idea.deletedAt && this.showDeletedIdea);
  };

  showIdea(value: boolean) {
    this.showDeletedIdea = value;
  }
  ideaEditMode() {
    /* this.editSubject = this.argument.subject;
     this.editText = this.argument.text;
     this.editType = this.argument.type;*/
    if (this.showEdit) { // Visible, so we gonna hide, need to clear form errors
      this.errors = [];
    }
    this.showEdit = !this.showEdit;
  };

  toggleEdit(event: any) {
    this.ideaEditMode();
  }
  doShowDeleteIdea() {
    const deleteArgument = this.dialog.open(ConfirmDialogComponent, {
      data: {
        level: 'delete',
        heading: 'MODALS.TOPIC_DELETE_IDEA_TITLE',
        title: 'MODALS.TOPIC_DELETE_IDEA_TITLE',
        points: ['MODALS.TOPIC_DELETE_IDEA_TXT_ARE_YOU_SURE'],
        confirmBtn: 'MODALS.TOPIC_DELETE_IDEA_BTN_YES',
        closeBtn: 'MODALS.TOPIC_DELETE_IDEA_BTN_NO'
      }
    });

    deleteArgument.afterClosed().subscribe((confirm) => {
      if (confirm === true) {
        const idea = Object.assign({ topicId: this.topic.id, ideaId: this.idea.id, ideationId: this.ideationId });
        console.log(idea);
        this.TopicIdeaService
          .delete(idea)
          .pipe(take(1))
          .subscribe(() => {
            this.TopicIdeaService.reset();
          });
      }
    });
  };

  doIdeaReport() {
    this.dialog.open(IdeaReportComponent, {
      data: {
        idea: this.idea,
        ideationId: this.ideationId,
        topicId: this.topic.id
      }
    });
  };

  doIdeaVote(value: number) {
    if (!this.Auth.loggedIn$.value) {
      return;
    }

    const idea = {
      ideaId: this.idea.id,
      ideationId: this.ideationId,
      topicId: this.topic.id,
      value: value
    };

    this.TopicIdeaService
      .vote(idea)
      .pipe(take(1))
      .subscribe((voteResult) => {
        this.idea.votes = voteResult;
      });
  };

  toggleFavourite() {
    this.TopicIdeaService.toggleFavourite({favourite: this.idea.favourite, topicId: this.topic.id, ideationId: this.ideationId, ideaId: this.idea.id});
    this.idea.favourite = !this.idea.favourite;
  }

  doShowVotersList() {
    /*  this.dialog.open(ArgumentReactionsComponent, {
        data: {
          commentId: this.argument.id,
          topicId: this.topicId
        }
      });/*
    };

    private scrollTo(argumentEl: HTMLElement | null) {
      if (argumentEl) {
        const bodyEl: HTMLElement | null = argumentEl.querySelector('.argument_body');
        if (bodyEl)
          bodyEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        argumentEl.classList.add('highlight');
        setTimeout(() => {
          argumentEl?.classList.remove('highlight');
        }, 2000);
      }*/
  }

  addToFolder() {
    const addToFolderDialog = this.dialog.open(AddIdeaFolderComponent, {
      data: {
        topicId: this.topic.id,
        ideationId: this.ideationId,
        idea:this.idea
      }
    })
  }

  reportReasonDialog() {
    this.dialog.open(IdeaReportReasonComponent, {
      data: {
        report: {
          moderatedReasonText: this.idea.deletedReasonText,
          moderatedReasonType: this.idea.deletedReasonType
        }
      }
    })
  }
}
