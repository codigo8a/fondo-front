export interface IAlertDialogData {
  title: string;
  message: string;
  type: AlertType;
}

export interface IAlertDialogActions {
  close(): void;
}

export interface IAlertDialogPresentation {
  getIcon(): string;
  getButtonColor(): string;
}

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface IAlertDialogConfig {
  width?: string;
  maxWidth?: string;
  disableClose?: boolean;
  panelClass?: string;
  backdropClass?: string;
}