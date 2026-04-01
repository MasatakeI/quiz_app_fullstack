import React from "react";

import IconButton from "@/components/common/IconButton/IconButton";

import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Checkbox from "@mui/material/Checkbox";

const CheckContainer = ({
  label,
  histories,
  selectedIds,
  handleOnChange,
  handleModalOpen,
}) => {
  return (
    <>
      <label>
        <Checkbox
          {...label}
          checked={
            histories.length > 0 && selectedIds.length === histories.length
          }
          indeterminate={
            selectedIds.length > 0 && selectedIds.length < histories.length
          }
          onChange={handleOnChange}
        />
        全選択
      </label>

      {selectedIds.length > 0 && (
        <div className="buld-action-bar">
          {`${selectedIds.length}件 選択中`}
          <IconButton
            title="削除"
            onClick={() => handleModalOpen()}
            icon={faTrash}
            isDelete={true}
          />
        </div>
      )}
    </>
  );
};

export default CheckContainer;
