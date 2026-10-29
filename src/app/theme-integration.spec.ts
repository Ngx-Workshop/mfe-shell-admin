import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NgxThemePicker, ThemePickerService } from '@tmdjr/ngx-theme-picker';

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

  it('restores a saved selection during initialization without rendering a picker', () => {
    localStorage.setItem(ThemePickerService.THEME_STRORAGE_KEY, 'nasa');
    localStorage.setItem(ThemePickerService.DARK_MODE_STRORAGE_KEY, 'true');
    TestBed.inject(ThemePickerService);
    expect(document.documentElement.getAttribute('data-ngx-theme')).toBe('nasa-dark');
    expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark');
  });
});
