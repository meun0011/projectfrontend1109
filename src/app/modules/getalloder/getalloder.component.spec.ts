/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GetalloderComponent } from './getalloder.component';

describe('GetalloderComponent', () => {
  let component: GetalloderComponent;
  let fixture: ComponentFixture<GetalloderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetalloderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetalloderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
