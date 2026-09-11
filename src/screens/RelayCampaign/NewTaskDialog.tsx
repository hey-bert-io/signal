import './NewTaskDialog.css'

import { useEffect, useRef } from 'react'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { IconButton } from '../../components/IconButton'
import { Select } from '../../components/Select'
import { Status } from '../../components/Status'
import { TextField } from '../../components/TextField'
import plusIcon from '../RelayTasks/assets/plus.svg'
import closeIcon from './assets/x.svg'

export interface NewTaskDialogProps {
  onClose: () => void
}

const assetIcon = (source: string) => <img alt="" src={source} />

export function NewTaskDialog({ onClose }: NewTaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const taskNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
      taskNameRef.current?.focus()
    }
  }, [])

  return (
    <dialog
      aria-labelledby="relay-new-task-title"
      aria-modal="true"
      className="signal-new-task-dialog"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      ref={dialogRef}
      role="dialog"
    >
      <div className="signal-new-task-dialog__surface">
        <header className="signal-new-task-dialog__header">
          <h2 id="relay-new-task-title">New task</h2>
          <IconButton aria-label="Close new task dialog" icon={assetIcon(closeIcon)} onClick={onClose} size="small" variant="ghost" />
        </header>
        <form className="signal-new-task-dialog__form" onSubmit={(event) => { event.preventDefault(); onClose() }}>
          <TextField label={<>Task name <span aria-hidden="true" className="signal-new-task-dialog__required">*</span></>} placeholder="e.g. Write launch email" ref={taskNameRef} required />
          <div className="signal-new-task-dialog__split-fields">
            <Select defaultValue="Draft" label="Status"><option>Draft</option><option>In progress</option><option>Blocked</option><option>Done</option></Select>
            <Select defaultValue="Medium" label="Priority"><option>Low</option><option>Medium</option><option>High</option></Select>
          </div>
          <div className="signal-new-task-dialog__assignee">
            <span className="signal-new-task-dialog__field-label">Assignee</span>
            <div className="signal-new-task-dialog__assignee-control">
              <Avatar initials="SR" />
              <Select defaultValue="Sofia Reyes" hideLabel label="Assignee">
                <option>Sofia Reyes</option><option>Marcus Lin</option><option>Priya Nair</option><option>James Okafor</option><option>Clara Mendez</option>
              </Select>
            </div>
          </div>
          <TextField label="Due date" type="date" />
          <div className="signal-new-task-dialog__preview"><span>Preview:</span><Status>Draft</Status></div>
          <footer className="signal-new-task-dialog__footer">
            <Button onClick={onClose} type="button" variant="ghost">Cancel</Button>
            <Button leadingIcon={assetIcon(plusIcon)} type="submit">Create task</Button>
          </footer>
        </form>
      </div>
    </dialog>
  )
}
