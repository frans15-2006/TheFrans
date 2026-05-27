## 2026-05-22 - Synchronizing Custom Cursor and Animations with Keyboard Focus
**Learning:** Custom cursor systems and text animations triggered solely by mouse events (mouseenter, mouseover) exclude keyboard-only users from the full experience of "delight" and context. Synchronizing these with `focus` and `focusin` provides accessibility parity.
**Action:** Always ensure that interactive visual feedback (like custom cursors or hover-triggered text effects) has equivalent listeners for keyboard focus events.
