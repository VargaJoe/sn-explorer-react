import React, { useState, useEffect } from 'react';
import sensenetService from '../services/sensenet';
import { 
  Paper, 
  Box,
  Breadcrumbs,
  Link,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Resizable } from 're-resizable';

interface ContentListProps {
  currentPath: string;
  onPathChange: (path: string) => void;
}

interface Content {
  Id: number;
  Path: string;
  Name: string;
  DisplayName: string;
  Type: string;
  IsFolder: boolean;
  ModificationDate?: string;
  Size?: number;
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface Column {
  id: string;
  label: string;
  minWidth: number;
  width: number;
  align?: 'right' | 'left' | 'center';
}

const ContentList: React.FC<ContentListProps> = ({ currentPath, onPathChange }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: 'Root', path: '/Root' }]);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', minWidth: 170, width: 300 },
    { id: 'type', label: 'Type', minWidth: 100, width: 150 },
    { id: 'modificationDate', label: 'Modification Date', minWidth: 170, width: 200 },
  ]);

  useEffect(() => {
    fetchContents(currentPath);
    updateBreadcrumbs(currentPath);
  }, [currentPath]);

  const fetchContents = async (path: string) => {
    setIsLoading(true);
    try {
      const items = await sensenetService.loadChildren(path);
      console.log('API response items:', items); // Debug log
      setContents(items);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (content: Content) => {
    if (content.IsFolder) {
      onPathChange(content.Path);
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    onPathChange(path);
  };

  const updateBreadcrumbs = (path: string) => {
    if (path === '/Root') {
      setBreadcrumbs([{ name: 'Root', path: '/Root' }]);
      return;
    }

    const pathParts = path.split('/').filter(Boolean);
    const newBreadcrumbs = pathParts.reduce<BreadcrumbItem[]>((acc, part, index) => {
      const crumbPath = '/' + pathParts.slice(0, index + 1).join('/');
      acc.push({ name: part, path: crumbPath });
      return acc;
    }, []);
    
    setBreadcrumbs(newBreadcrumbs);
  };

  // Handle column resize
  const handleColumnResize = (index: number, newWidth: number) => {
    const updatedColumns = [...columns];
    updatedColumns[index].width = Math.max(updatedColumns[index].minWidth, newWidth);
    setColumns(updatedColumns);
  };

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
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
      </Paper>
      
      <Paper elevation={2} sx={{ flex: 1, overflow: 'hidden' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ height: '100%', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell 
                      key={column.id}
                      align={column.align}
                      style={{ width: column.width, minWidth: column.minWidth, padding: '8px' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          userSelect: 'none',
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {column.label}
                        </Typography>
                        
                        {index < columns.length - 1 && (
                          <Resizable
                            size={{ width: 10, height: 20 }}
                            maxWidth={500}
                            minWidth={column.minWidth}
                            enable={{
                              right: true,
                            }}
                            onResizeStop={(e, direction, ref, d) => {
                              handleColumnResize(index, column.width + d.width);
                            }}
                            handleStyles={{
                              right: {
                                width: '10px',
                                cursor: 'col-resize',
                              },
                            }}
                          >
                            <Divider orientation="vertical" sx={{ height: '100%', opacity: 0.5 }} />
                          </Resizable>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {contents.length > 0 ? (
                  contents.map((content) => (
                    <TableRow
                      hover
                      key={content.Id}
                      onClick={() => handleItemClick(content)}
                      sx={{ 
                        cursor: content.IsFolder ? 'pointer' : 'default',
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell style={{ width: columns[0].width }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {content.IsFolder ? (
                            <FolderIcon sx={{ color: '#f8d775' }} />
                          ) : (
                            <InsertDriveFileIcon />
                          )}
                          {content.DisplayName || content.Name}
                        </Box>
                      </TableCell>
                      <TableCell style={{ width: columns[1].width }}>
                        {content.Type}
                      </TableCell>
                      <TableCell style={{ width: columns[2].width }}>
                        {formatDate(content.ModificationDate)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <Box p={2} textAlign="center">
                        <Typography variant="body1" color="textSecondary">
                          No items found in this folder
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ContentList;