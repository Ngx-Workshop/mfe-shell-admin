import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NgxThemePicker, ThemePickerService } from '@tmdjr/ngx-theme-picker';

@Component({
  selector: 'shell-policy-select', imports: [MatSelectModule],
  template: `<mat-form-field><mat-label>Domain</mat-label>
    <mat-select value="admin" panelClass="ngx-design-system-overlay ngx-select-panel">
      <mat-option value="admin">Admin</mat-option><mat-option value="workshop">Workshop</mat-option>
    </mat-select></mat-form-field>`,
})
class ShellPolicySelect {}
@Component({
  selector: 'shell-policy-dialog', imports: [MatDialogModule],
  template: '<h2 mat-dialog-title>Shared policy</h2><mat-dialog-content>Document theme inherited.</mat-dialog-content>',
})
class ShellPolicyDialog {}

describe('Installed theme picker with shell global styles', () => {
  let previousTheme: string | null;
  let previousMode: string | null;
  let previousAttribute: string | null;
  let previousClasses: string;

  beforeEach(() => {
    previousTheme = localStorage.getItem(ThemePickerService.THEME_STRORAGE_KEY);
    previousMode = localStorage.getItem(ThemePickerService.DARK_MODE_STRORAGE_KEY);
    previousAttribute = document.documentElement.getAttribute('data-ngx-theme');
    previousClasses = document.body.className;
    localStorage.removeItem(ThemePickerService.THEME_STRORAGE_KEY);
    localStorage.removeItem(ThemePickerService.DARK_MODE_STRORAGE_KEY);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    for (const [key, value] of [
      [ThemePickerService.THEME_STRORAGE_KEY, previousTheme],
      [ThemePickerService.DARK_MODE_STRORAGE_KEY, previousMode],
    ]) {
      if (value === null) localStorage.removeItem(key!);
      else localStorage.setItem(key!, value!);
    }
    document.body.className = previousClasses;
    if (previousAttribute === null) document.documentElement.removeAttribute('data-ngx-theme');
    else document.documentElement.setAttribute('data-ngx-theme', previousAttribute);
  });

  it('selects every installed family and mode with matching root and overlay tokens', () => {
    TestBed.configureTestingModule({ imports: [NgxThemePicker] });
    const fixture = TestBed.createComponent(NgxThemePicker);
    fixture.detectChanges();
    const picker = fixture.componentInstance;
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    const colors = new Set<string>();
    for (const theme of ThemePickerService.THEMES) {
      picker.selectTheme(theme.name);
      for (const dark of [false, true]) {
        picker.themePickerService.darkMode.set(dark);
        TestBed.tick();
        expect(document.documentElement.getAttribute('data-ngx-theme'))
          .toBe(dark ? theme.darkTheme : theme.lightTheme);
        const root = getComputedStyle(document.documentElement);
        const overlayCss = getComputedStyle(overlay);
        const primary = root.getPropertyValue('--ngx-color-primary').trim();
        colors.add(primary);
        expect(primary).not.toBe('');
        expect(root.getPropertyValue('--mat-sys-primary').trim()).toBe(primary);
        expect(overlayCss.getPropertyValue('--mat-sys-primary').trim()).toBe(primary);
        expect(overlayCss.colorScheme).toBe(theme.name === 'neutral' || dark ? 'dark' : 'light');
        expect(localStorage.getItem(ThemePickerService.THEME_STRORAGE_KEY)).toBe(theme.name);
      }
    }
    expect(colors.size).toBe(11);
  });

  it('supplies detached select and dialog policy from the shell stylesheet in light and dark modes', async () => {
    TestBed.configureTestingModule({ imports: [ShellPolicySelect, ShellPolicyDialog],
      providers: [provideZonelessChangeDetection(), {provide: OVERLAY_DEFAULT_CONFIG, useValue: {usePopover: false}}] });
    const fixture = TestBed.createComponent(ShellPolicySelect);
    fixture.detectChanges(); await fixture.whenStable();
    const select = fixture.debugElement.query(By.directive(MatSelect)).componentInstance as MatSelect;
    const container = TestBed.inject(OverlayContainer).getContainerElement();
    for (const [theme, scheme] of [['light', 'light'], ['neon', 'dark']]) {
      document.documentElement.setAttribute('data-ngx-theme', theme);
      select.open(); fixture.detectChanges(); await fixture.whenStable();
      const panel = select.panel.nativeElement as HTMLElement;
      expect(container.contains(panel)).toBeTrue();
      expect(panel.classList.contains('ngx-select-panel')).toBeTrue();
      expect(getComputedStyle(panel).colorScheme).toBe(scheme);
      expect(getComputedStyle(panel).animationFillMode).toBe('forwards');
      const backdrop = document.querySelector('.cdk-overlay-transparent-backdrop')!;
      expect(getComputedStyle(backdrop).backdropFilter).toBe('none');
      expect(getComputedStyle(backdrop).backgroundColor).toMatch(/^rgba\(\d+, \d+, \d+, 0\)$/);
      select.close(); fixture.detectChanges(); await fixture.whenStable();
      const dialog = TestBed.inject(MatDialog).open(ShellPolicyDialog, {
        panelClass:'ngx-design-system-overlay', backdropClass:'ngx-design-system-backdrop',
      });
      fixture.detectChanges(); await fixture.whenStable();
      const pane = document.querySelector('.cdk-overlay-pane.ngx-design-system-overlay')!;
      expect(getComputedStyle(pane).colorScheme).toBe(scheme);
      expect(getComputedStyle(document.querySelector('.ngx-design-system-backdrop')!).backdropFilter).toContain('blur(12px)');
      dialog.close(); fixture.detectChanges(); await fixture.whenStable();
    }
  });

  it('restores a saved selection during initialization without rendering a picker', () => {
    localStorage.setItem(ThemePickerService.THEME_STRORAGE_KEY, 'nasa');
    localStorage.setItem(ThemePickerService.DARK_MODE_STRORAGE_KEY, 'true');
    TestBed.inject(ThemePickerService);
    expect(document.documentElement.getAttribute('data-ngx-theme')).toBe('nasa-dark');
    expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark');
  });
});
