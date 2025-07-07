import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import sensenetService from '../services/sensenet';

interface TreeExplorerProps {
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
}

interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: string;
  children: TreeNode[];
  isLoaded: boolean;
}

const TreeExplorer: React.FC<TreeExplorerProps> = ({ currentPath, onPathChange }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['/Root']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string>(currentPath);
  
  // Initial load of Root
  useEffect(() => {
    loadNodeChildren('/Root');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to find a node in the tree by path
  const findNodeInTree = (nodes: TreeNode[], path: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.path === path) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeInTree(node.children, path);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // Recursively expand and load all nodes down the path
  const expandAndLoadPath = async (fullPath: string) => {
    const pathParts = fullPath.split('/').filter(Boolean);
    let currentPath = '';
    let parentNodes = treeData;
    let expanded: string[] = ['/Root'];
    for (let i = 0; i < pathParts.length; i++) {
      currentPath = currentPath ? `${currentPath}/${pathParts[i]}` : `/${pathParts[i]}`;
      expanded.push(currentPath);
      let node = findNodeInTree(parentNodes, currentPath);
      if (!node || !node.isLoaded) {
        await loadNodeChildren(currentPath);
        // After loading, get the updated node reference
        node = findNodeInTree(treeData, currentPath);
      }
      parentNodes = node && node.children ? node.children : [];
    }
    setExpandedNodes(prev => Array.from(new Set([...prev, ...expanded])));
    setSelectedNode(fullPath);
  };

  // Expand nodes based on current path
  useEffect(() => {
    if (currentPath) {
      expandAndLoadPath(currentPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  const loadNodeChildren = async (path: string) => {
    setIsLoading(true);
    try {
      let contents = await sensenetService.loadChildren(path);
      const folderContents = contents.filter((content: Content) => content.IsFolder);
      updateTreeWithNewNodes(path, folderContents);
      // If loading root, expand all its children by default
      if (path === '/Root') {
        setExpandedNodes(['/Root', ...folderContents.map(f => f.Path)]);
      }
    } catch (error) {
      console.error('Error fetching tree nodes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTreeWithNewNodes = (parentPath: string, children: Content[]) => {
    const childNodes = children.map((child: Content) => ({
      id: child.Path,
      name: child.DisplayName || child.Name,
      path: child.Path,
      type: child.Type,
      children: [],
      isLoaded: false
    }));
    setTreeData(prevTree => {
      if (parentPath === '/Root') {
        // Always update root node's children and isLoaded
        return [{
          id: '/Root',
          name: 'Root',
          path: '/Root',
          type: 'PortalRoot',
          children: childNodes,
          isLoaded: true
        }];
      }
      
      // Deep clone the tree and update the specific node
      const updatedTree = JSON.parse(JSON.stringify(prevTree));
      const updateNode = (nodes: TreeNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].path === parentPath) {
            nodes[i].children = childNodes;
            nodes[i].isLoaded = true;
            return true;
          }
          const nodeChildren = nodes[i].children;
          if (nodeChildren && nodeChildren.length > 0) {
            if (updateNode(nodeChildren)) {
              return true;
            }
          }
        }
        return false;
      };
      updateNode(updatedTree);
      return updatedTree;
    });
  };

  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    setSelectedNode(nodeId);
    onPathChange(nodeId);
  };

  // Toggle expand/collapse for a node
  const handleExpandCollapse = async (node: TreeNode) => {
    console.log('Chevron clicked for', node.path, 'isLoaded:', node.isLoaded, 'isExpanded:', expandedNodes.includes(node.path));
    const isExpanded = expandedNodes.includes(node.path);
    if (!node.isLoaded) {
      // Always load children and expand if not loaded, never collapse
      console.log('Loading children for', node.path);
      await loadNodeChildren(node.path);
      console.log('Loaded children for', node.path);
      setExpandedNodes(prev => prev.includes(node.path) ? prev : [...prev, node.path]);
      return;
    }
    if (isExpanded) {
      // Collapse: remove from expandedNodes
      setExpandedNodes(expandedNodes.filter(p => p !== node.path));
    } else {
      // Expand: already loaded
      setExpandedNodes(prev => prev.includes(node.path) ? prev : [...prev, node.path]);
    }
  };

  // Recursive render function for tree nodes
  const renderTreeNodes = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes.includes(node.path);
      const isLoaded = node.isLoaded;
      const hasChildren = (node.children && node.children.length > 0) || !isLoaded;
      // Chevron logic: show closed (>) if not expanded or not loaded, open (v) only if expanded and loaded
      const showChevron = hasChildren;
      const showOpenChevron = isExpanded && isLoaded && node.children && node.children.length > 0;
      return (
        <li key={node.id} style={{ paddingLeft: level * 16 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {showChevron ? (
              <span
                style={{ cursor: 'pointer', marginRight: 4, display: 'inline-flex', alignItems: 'center', width: 20 }}
                onClick={e => { e.stopPropagation(); handleExpandCollapse(node); }}
                aria-label={showOpenChevron ? 'Collapse' : 'Expand'}
              >
                {showOpenChevron ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
              </span>
            ) : (
              <span style={{ width: 20, display: 'inline-block' }} />
            )}
            <button
              style={{
                background: node.path === selectedNode ? '#e3f2fd' : 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                padding: '4px 8px',
                textAlign: 'left',
                width: '100%',
                fontWeight: node.path === selectedNode ? 'bold' : 'normal',
              }}
              onClick={() => handleNodeSelect(null as any, node.path)}
            >
              <FolderIcon sx={{ color: '#f8d775', verticalAlign: 'middle', mr: 1 }} />
              {node.name}
            </button>
          </div>
          {/* Only render children if expanded and loaded and has children */}
          {isExpanded && isLoaded && node.children && node.children.length > 0 && (
            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
              {renderTreeNodes(node.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <Box sx={{ p: 1, height: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        Folder Explorer
      </Typography>
      {isLoading && treeData.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {treeData.length > 0 && renderTreeNodes(treeData)}
        </ul>
      )}
    </Box>
  );
};

export default TreeExplorer;