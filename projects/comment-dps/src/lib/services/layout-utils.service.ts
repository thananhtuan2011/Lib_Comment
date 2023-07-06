// Angular
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionNotificationComponent } from '../action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from '../delete-entity-dialog/delete-entity-dialog.component';
// Partials for CRUD

export enum MessageType {
	Create,
	Read,
	Update,
	Delete
}

@Injectable()
export class LayoutUtilsService {
	/**
	 * Service constructor
	 *
	 * @param snackBar: MatSnackBar
	 * @param dialog: MatDialog
	 */
	constructor(private snackBar: MatSnackBar,
		private dialog: MatDialog) { }

	/**
	 * Showing (Mat-Snackbar) Notification
	 *
	 * @param message: string
	 * @param type: MessageType
	 * @param duration: number
	 * @param showCloseButton: boolean
	 * @param showUndoButton: boolean
	 * @param undoButtonDuration: number
	 * @param verticalPosition: 'top' | 'bottom' = 'top'
	 *  * @param horizontalPosition: 'start' | 'start' = 'start'
	 * 	
	
	 */
	showActionNotification(
		_message: string,
		_type: MessageType = MessageType.Create,
		_duration: number = 10000,
		_showCloseButton: boolean = true,
		_showUndoButton: boolean = true,
		_undoButtonDuration: number = 3000,
		_verticalPosition: 'top' | 'bottom' = 'bottom',
		mean: 0 | 1 = 1
	) {
		const _data = {
			message: _message,
			snackBar: this.snackBar,
			showCloseButton: _showCloseButton,
			showUndoButton: _showUndoButton,
			undoButtonDuration: _undoButtonDuration,
			verticalPosition: _verticalPosition,
			type: _type,
			action: 'Undo',
			meanMes: mean
		};
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: _duration,
			data: _data,
			verticalPosition: _verticalPosition
		});
	}

	showInfo(
		message: string,
	) {
		let type: MessageType = MessageType.Create,
			duration: number = 100000,
			showCloseButton: boolean = true,
			showUndoButton: boolean = false,
			undoButtonDuration: number = 3000,
			verticalPosition: 'top' | 'bottom' = 'top',
			mean: 0 | 1 = 1
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration,
			data: {
				message,
				snackBar: this.snackBar,
				showCloseButton: showCloseButton,
				showUndoButton: showUndoButton,
				undoButtonDuration,
				verticalPosition,
				type,
				action: 'Undo',
				meanMes: mean
			},
			verticalPosition: verticalPosition
		});
	}



	/**
	 * Showing Confirmation (Mat-Dialog) before Entity Removing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 * @param waitDesciption: string
	 */
	deleteElement(title: string = '', description: string = '', waitDesciption: string = '') {
		return this.dialog.open(DeleteEntityDialogComponent, {
			data: { title, description, waitDesciption },
			width: '440px'
		});
	}

	/**
	 * Showing Fetching Window(Mat-Dialog)
	 *
	 * @param _data: any
	 */




}
