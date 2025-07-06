import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
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

  // Expand nodes based on current path
  useEffect(() => {
    if (currentPath) {
      const pathParts = currentPath.split('/').filter(Boolean);
      let currentExpandPath = '';
      const newExpanded: string[] = [];
      const parentPaths: string[] = [];
      // Build all parent paths up to the current node
      pathParts.forEach((part, idx) => {
        currentExpandPath = currentExpandPath ? `${currentExpandPath}/${part}` : `/${part}`;
        newExpanded.push(currentExpandPath);
        // For all but the last part (the selected node), load children
        if (idx < pathParts.length - 1) parentPaths.push(currentExpandPath);
      });
      // Expand all parent paths
      setExpandedNodes((prev) => {
        const combined = [...prev, ...newExpanded];
        return Array.from(new Set(combined));
      });
      setSelectedNode(currentPath);
      // Recursively load all parent nodes' children (in order)
      (async () => {
        for (const parentPath of parentPaths) {
          const node = findNodeInTree(treeData, parentPath);
          if (!node || !node.isLoaded) {
            await loadNodeChildren(parentPath);
          }
        }
      })();
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

  const handleNodeToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    // Always keep /Root expanded
    if (!nodeIds.includes('/Root')) nodeIds.push('/Root');
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

  // Recursive render function for tree nodes
  const renderTreeNodes = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes.includes(node.path);
      return (
        <li key={node.id} style={{ paddingLeft: level * 16 }}>
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
          {/* Render children if expanded and has children */}
          {isExpanded && node.children && node.children.length > 0 && (
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
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