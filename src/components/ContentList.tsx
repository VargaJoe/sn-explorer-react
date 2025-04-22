import React, { useState, useEffect } from 'react';
import sensenetService from '../services/sensenet';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Paper, 
  Typography, 
  Box,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Content {
  Id: number;
  Path: string;
  Name: string;
  DisplayName: string;
  Type: string;
  IsFolder: boolean;
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

const ContentList: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('/Root');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: 'Root', path: '/Root' }]);

  useEffect(() => {
    fetchContents(currentPath);
  }, [currentPath]);

  const fetchContents = async (path: string) => {
    setIsLoading(true);
    try {
      const items = await sensenetService.loadChildren(path);
      setContents(items);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (content: Content) => {
    if (content.IsFolder) {
      const newPath = content.Path;
      setCurrentPath(newPath);
      
      // Update breadcrumbs
      const pathParts = newPath.split('/').filter(Boolean);
      const newBreadcrumbs = pathParts.reduce<BreadcrumbItem[]>((acc, part, index) => {
        const path = '/' + pathParts.slice(0, index + 1).join('/');
        acc.push({ name: part, path });
        return acc;
      }, []);
      
      if (newBreadcrumbs.length === 0) {
        setBreadcrumbs([{ name: 'Root', path: '/Root' }]);
      } else {
        setBreadcrumbs(newBreadcrumbs);
      }
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path);
    // Update breadcrumbs when clicking on a breadcrumb
    const pathParts = path.split('/').filter(Boolean);
    const newBreadcrumbs = pathParts.reduce<BreadcrumbItem[]>((acc, part, index) => {
      const crumbPath = '/' + pathParts.slice(0, index + 1).join('/');
      acc.push({ name: part, path: crumbPath });
      return acc;
    }, []);
    
    if (newBreadcrumbs.length === 0) {
      setBreadcrumbs([{ name: 'Root', path: '/Root' }]);
    } else {
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Sensenet Content Explorer
        </Typography>
        
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link 
            color="inherit" 
            onClick={(e) => {
              e.preventDefault();
              handleBreadcrumbClick('/Root');
            }}
            href="#"
            underline="hover"
          >
            Root
          </Link>
          
          {breadcrumbs.slice(1).map((breadcrumb, index) => (
            <Link
              key={index}
              color="inherit"
              onClick={(e) => {
                e.preventDefault();
                handleBreadcrumbClick(breadcrumb.path);
              }}
              href="#"
              underline="hover"
            >
              {breadcrumb.name}
            </Link>
          ))}
        </Breadcrumbs>
        
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {contents.length > 0 ? (
              contents.map((content) => (
                <ListItem key={content.Id} disablePadding>
                  <ListItemButton onClick={() => handleItemClick(content)}>
                    <ListItemIcon>
                      {content.IsFolder ? (
                        <FolderIcon sx={{ color: '#f8d775' }} />
                      ) : (
                        <InsertDriveFileIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={content.DisplayName || content.Name} 
                      secondary={content.Type} 
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box p={2} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                  No items found in this folder
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default ContentList;