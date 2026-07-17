import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { CopilotConversation } from '../../domain/entities/CopilotConversation';
import { CopilotMessage } from '../../domain/entities/CopilotMessage';
import { StudySpaceCopilotPanelComponent } from './study-space-copilot-panel.component';

describe('StudySpaceCopilotPanelComponent', () => {
  function render(conversation: CopilotConversation): ComponentFixture<StudySpaceCopilotPanelComponent> {
    const fixture = TestBed.createComponent(StudySpaceCopilotPanelComponent);
    fixture.componentRef.setInput('conversation', conversation);
    fixture.componentRef.setInput('availability', 'available');
    fixture.componentRef.setInput('canSendMessage', true);
    fixture.detectChanges();
    return fixture;
  }

  it('renders an empty conversation state without clear action', () => {
    const fixture = render(CopilotConversation.create([]));

    expect(fixture.nativeElement.textContent).toContain('No conversation yet');
    expect(fixture.nativeElement.textContent).not.toContain('Clear conversation');
  });

  it('renders clear conversation action only when history exists', () => {
    const fixture = render(CopilotConversation.create([
      CopilotMessage.create({ id: 'msg-1', role: 'user', content: 'What is habeas corpus?' }),
    ]));

    expect(fixture.nativeElement.textContent).toContain('Clear conversation');
  });

  it('asks for confirmation before emitting clear conversation', () => {
    const fixture = render(CopilotConversation.create([
      CopilotMessage.create({ id: 'msg-1', role: 'user', content: 'What is habeas corpus?' }),
    ]));
    const emitSpy = vi.spyOn(fixture.componentInstance.clearConversation, 'emit');

    fixture.nativeElement.querySelector('.clear-button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('This removes the visible copilot history');
    expect(emitSpy).not.toHaveBeenCalled();

    fixture.nativeElement.querySelector('.confirm-button').click();

    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('cancels clear confirmation without emitting', () => {
    const fixture = render(CopilotConversation.create([
      CopilotMessage.create({ id: 'msg-1', role: 'user', content: 'What is habeas corpus?' }),
    ]));
    const emitSpy = vi.spyOn(fixture.componentInstance.clearConversation, 'emit');

    fixture.nativeElement.querySelector('.clear-button').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.cancel-button').click();
    fixture.detectChanges();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });
});
