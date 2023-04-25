import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExtensionID } from '../extension-id.model';

@Component({
  selector: 'jhi-extension-id-detail',
  templateUrl: './extension-id-detail.component.html',
})
export class ExtensionIDDetailComponent implements OnInit {
  extensionID: IExtensionID | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extensionID }) => {
      this.extensionID = extensionID;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
