import React from 'react';
import { 
  Paper, 
  Toolbar, 
  Button, 
  Tooltip, 
  Divider,
  ButtonGroup  
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SortIcon from '@mui/icons-material/Sort';

const ActionToolbar: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ mb: 2 }}>
      <Toolbar variant="dense" sx={{ minHeight: '48px' }}>
        <ButtonGroup variant="text" size="small" sx={{ mr: 1 }}>
          <Tooltip title="New Item">
            <Button startIcon={<AddIcon />}>
              New
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <ButtonGroup variant="text" size="small" sx={{ mr: 1 }}>
          <Tooltip title="Cut">
            <Button startIcon={<ContentCutIcon />}>
              Cut
            </Button>
          </Tooltip>
          
          <Tooltip title="Copy">
            <Button startIcon={<ContentCopyIcon />}>
              Copy
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <ButtonGroup variant="text" size="small" sx={{ mr: 1 }}>
          <Tooltip title="Rename">
            <Button startIcon={<DriveFileRenameOutlineIcon />}>
              Rename
            </Button>
          </Tooltip>
        </ButtonGroup>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <ButtonGroup variant="text" size="small">
          <Tooltip title="Sort">
            <Button startIcon={<SortIcon />}>
              Sort
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Toolbar>
    </Paper>
  );
};

export default ActionToolbar;