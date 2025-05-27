"use client"

import React, { useEffect, useRef, useCallback } from "react"

import styles from "./ModalCard.module.scss"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const ModalCard: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  if (!isOpen) return null

  return (
    <div className={styles.modal_overlay}>
      <div ref={modalRef} className={styles.modal_content}>
        <button className={styles.close_button} onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  )
}
