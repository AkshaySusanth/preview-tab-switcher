# Arc-like Tab Switcher

A Chrome browser extension that brings the intuitive tab switching experience of the Arc browser to any Chromium-based browser.

## Overview

The **Arc-like Tab Switcher** is a powerful productivity extension that provides a visual, grid-based interface for switching between open tabs. Inspired by Arc browser's elegant design, it displays tab previews, favicons, and titles in an organized layout, making it faster and easier to navigate between multiple tabs.

## Features

✨ **Visual Tab Preview** - See thumbnails of each tab's content before switching  
⌨️ **Keyboard Shortcut** - Press `Alt+Q` to instantly open the tab switcher  
🎯 **Smart Tab Ordering** - Uses Most Recently Used (MRU) algorithm to prioritize frequently accessed tabs  
🖱️ **Point & Click Navigation** - Click any tab card to switch directly to it  
⌨️ **Keyboard Navigation** - Navigate tabs using arrow keys, Tab key, or mouse hover  
📦 **Lightweight & Fast** - Minimal memory footprint with instant tab switching  
🌙 **Modern Dark Theme** - Sleek Arc-inspired design with blue accent highlights  
🔄 **Auto Screenshot Capture** - Automatically captures tab screenshots for preview  

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. Clone or download this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked** and select the extension folder
5. The extension is now installed and ready to use!

## Usage

### Opening the Tab Switcher

- **Keyboard Shortcut**: Press `Alt+Q` on any keyboard layout
- **Click Extension Icon**: Click the extension icon in the Chrome toolbar

### Switching Tabs

- **Click**: Click directly on any tab card to switch to it
- **Arrow Keys**: Use left/right or up/down arrow keys to navigate
- **Tab Key**: Press Tab to move forward through tabs, Shift+Tab to go backward
- **Mouse Hover**: Hover over a tab to preview it (visual indication)
- **Enter**: Press Enter to switch to the currently selected tab

### Understanding the Interface

- **Tab Cards**: Display up to 8 most recently used tabs
- **Preview Image**: Shows a visual snapshot of the webpage
- **Favicon**: Website icon in the bottom-left corner
- **Title**: Page title displayed below the preview
- **Blue Border**: Indicates the currently selected tab
- **Scale Effect**: Selected tab scales up slightly for better visibility

## How It Works

### Tab Tracking
- Uses the **Most Recently Used (MRU) algorithm** to maintain a prioritized list of tabs
- Automatically updates when you switch between tabs
- Preserves tab order across browser sessions

### Screenshot Capture
- Captures tab screenshots when you switch to a tab
- Stores screenshots in local Chrome storage
- Automatically cleans up old screenshots when tabs are closed
- Falls back to website favicon if screenshot is unavailable

### Performance
- Uses a lightweight background service worker
- Efficiently manages storage with automatic cleanup
- Minimal CPU and memory usage

## Project Structure

```
├── manifest.json      # Extension configuration and permissions
├── popup.html         # UI structure for the tab switcher
├── popup.css          # Styling with Arc-inspired dark theme
├── popup.js           # Tab selection, navigation, and interaction logic
├── background.js      # MRU tracking, screenshot capture, and tab management
└── README.md          # This file
```

## Configuration

The extension uses the following permissions:
- **tabs** - Access to tab information and switching
- **storage** - Store MRU state and screenshots locally
- **unlimitedStorage** - No limit on screenshot storage

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Tab Switcher | `Alt+Q` |
| Navigate Right/Down | `Arrow Right` / `Arrow Down` |
| Navigate Left/Up | `Arrow Left` / `Arrow Up` |
| Next Tab | `Tab` |
| Previous Tab | `Shift+Tab` |
| Switch to Selected | `Enter` |
| Close Popup | `Escape` |

## Browser Support

- ✅ Google Chrome (v88+)
- ✅ Chromium
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Other Chromium-based browsers

## Technical Details

### Technologies Used
- **Manifest V3** - Latest Chrome extension API
- **Chrome Tabs API** - Tab management and switching
- **Chrome Storage API** - Local storage for MRU state and screenshots
- **Vanilla JavaScript** - No external dependencies
- **CSS3** - Modern styling with transitions and transforms

### File Limits
- Maximum 8 tabs displayed in the switcher (showing most recent)
- Unlimited storage for screenshots (configurable)
- Automatic cleanup of orphaned screenshots

## Troubleshooting

### Keyboard Shortcut Not Working
- Check if another extension is using the `Alt+Q` shortcut
- Try accessing through the extension icon instead
- Restart your browser

### Screenshots Not Showing
- Allow the extension to capture screen content
- Check `chrome://extensions/` permissions
- Reload the extension

### Extension Not Loading
- Ensure you're on Chrome v88 or higher
- Check `chrome://extensions/` for error messages
- Reload the extension using the refresh icon

## Performance Tips

- The extension works best with 5-50 open tabs
- Screenshot capture happens automatically; no manual action needed
- Close unused tabs to improve browsing performance

## Privacy & Security

- All screenshots are stored **locally** in your browser
- No data is sent to external servers
- No tracking or analytics
- Extension only accesses tab metadata (title, URL, icon)

## Future Enhancements

- 🎨 Customizable themes and colors
- 📊 Tab search and filtering
- 🏷️ Tab grouping and labeling
- ⌨️ Customizable keyboard shortcuts
- 🔌 Search functionality within tab switcher
- 📱 Multi-window support enhancements

## Known Limitations

- Screenshot capture may take a moment on slower systems
- Very large tab counts (100+) may slow down the switcher
- Private/Incognito tabs are handled per Chrome's restrictions
- Some websites may block screenshot capture for security reasons

## Contributing

Found a bug? Have a feature idea? Feel free to open an issue or submit a pull request!

## License

MIT License - Feel free to use, modify, and distribute this extension.

## Credits

Inspired by the excellent tab switching experience in [Arc Browser](https://arc.net/).

---

**Version**: 1.0  
**Last Updated**: 2026  
**Maintainer**: Arc-like Tab Switcher Community
