/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RawsignComponent } from './rawsign.component';

describe('RawsignComponent', () => {
  let component: RawsignComponent;
  let fixture: ComponentFixture<RawsignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawsignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
