import React, { useState, useEffect } from 'react';
import { 
  TreeView, 
  TreeItem 
} from '@mui/lab';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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

  // Expand nodes based on current path
  useEffect(() => {
    if (currentPath) {
      const pathParts = currentPath.split('/').filter(Boolean);
      let currentExpandPath = '';
      
      const newExpanded = pathParts.map((part) => {
        currentExpandPath = currentExpandPath ? `${currentExpandPath}/${part}` : `/${part}`;
        return currentExpandPath;
      });
      
      // Make sure all parent paths are expanded
      setExpandedNodes((prev) => {
        const combined = [...prev, ...newExpanded];
        return Array.from(new Set(combined));
      });
      
      setSelectedNode(currentPath);
      
      // Make sure the path is loaded in the tree
      if (pathParts.length > 1) {
        const parentPath = '/' + pathParts.slice(0, -1).join('/');
        loadNodeChildren(parentPath);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  const loadNodeChildren = async (path: string) => {
    setIsLoading(true);
    try {
      const contents = await sensenetService.loadChildren(path);
      const folderContents = contents.filter((content: Content) => content.IsFolder);
      
      updateTreeWithNewNodes(path, folderContents);
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
      children: [],
      isLoaded: false
    }));
    
    setTreeData(prevTree => {
      if (parentPath === '/Root' && prevTree.length === 0) {
        return [{
          id: '/Root',
          name: 'Root',
          path: '/Root',
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
          
          // Fix TypeScript errors by ensuring children is an array before checking length
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

  const handleNodeToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpandedNodes(nodeIds);
    
    // Load children for newly expanded nodes
    const newlyExpanded = nodeIds.filter(nodeId => !expandedNodes.includes(nodeId));
    
    newlyExpanded.forEach(path => {
      const nodeInTree = findNodeInTree(treeData, path);
      if (nodeInTree && !nodeInTree.isLoaded) {
        loadNodeChildren(path);
      }
    });
  };
  
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

  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    setSelectedNode(nodeId);
    onPathChange(nodeId);
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <TreeItem 
        key={node.id} 
        nodeId={node.path} 
        label={node.name}
        icon={<FolderIcon sx={{ color: '#f8d775' }} />}
        expandIcon={<ChevronRightIcon />}
        collapseIcon={<ExpandMoreIcon />}
      >
        {node.children && node.children.length > 0
          ? renderTree(node.children)
          : null}
      </TreeItem>
    ));
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
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expandedNodes}
          selected={selectedNode}
          onNodeToggle={handleNodeToggle}
          onNodeSelect={handleNodeSelect}
          sx={{ flexGrow: 1, overflow: 'auto' }}
        >
          {renderTree(treeData)}
        </TreeView>
      )}
    </Box>
  );
};

export default TreeExplorer;