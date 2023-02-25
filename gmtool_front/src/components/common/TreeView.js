import React from 'react';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

import { alpha, styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';

import { animated, useSpring } from '@react-spring/web';
//import { Badge } from 'react-bootstrap';
import Badge from '@mui/material/Badge';
import { FcFolder, FcOpenedFolder, FcFile } from 'react-icons/fc';
import { logger } from 'util/com';

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = styled((props) => {
  return <TreeItem {...props} TransitionComponent={TransitionComponent} />;
})(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const MakeData = (data) => {
  let node_id = 0;

  let defaultExpanded = [];
  const expend = data.expend_depth === undefined ? 0 : data.expend_depth;

  const id_increment = (item, depth) => {
    item.id = String(++node_id);
    item.depth = depth === undefined ? 0 : depth;

    if (expend > item.depth) defaultExpanded.push(item.id);

    if (item.children) {
      item.children.forEach((child_item) => {
        id_increment(child_item, item.depth + 1);
      });
    }
  };

  id_increment(data);

  return { data, defaultExpanded };
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -15,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Label = ({ label, children }) => {
  if (children === undefined) return <>{label}</>;

  return (
    <>
      <StyledBadge badgeContent={children.length} showZero color="primary">
        {label}
      </StyledBadge>
    </>
  );
};

const MyTree = ({ option, onNodeClick, onNodeContextMenu }) => {
  const { data, defaultExpanded } = MakeData(option);
  logger.render('MyTree : ', JSON.stringify(option, null, 2));

  const renderChild = (children) => {
    if (!children) return null;

    if (children.length === 0) return <div>--- empty ---</div>;
    return children.map((node) => renderTree(node));
  };
  const renderTree = (nodes) => {
    return (
      <StyledTreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={<Label label={nodes.name} children={nodes.children} />}
        onClick={() => {
          onNodeClick(nodes);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation(); // 이벤트 전달 막기
          onNodeContextMenu(nodes);
          return false;
        }}
      >
        {renderChild(nodes.children)}
      </StyledTreeItem>
    );
  };

  return (
    <TreeView
      aria-label="customized"
      defaultExpanded={defaultExpanded}
      defaultExpandIcon={<FcFolder />}
      defaultCollapseIcon={<FcOpenedFolder />}
      defaultEndIcon={<FcFile />}
      sx={data.sx ? data.sx : undefined}
    >
      {renderTree(data)}
    </TreeView>
  );
};

export default MyTree;
