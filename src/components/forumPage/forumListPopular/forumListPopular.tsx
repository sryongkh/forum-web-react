import React from "react";

const ForumListPopular = () => {
  return (
    <div className="h-full w-full">
      <table className="w-full">
        <tbody>
          <tr className="border-b text-xs font-bold">
            <td className="w-6/12">TOPIC</td>
            <td className="w-2/12">CATEGORY</td>
            <td className="w-3/12">USERS</td>
            <td className="w-2/12">REPLIES</td>
            <td className="w-2/12">VIEWS</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ForumListPopular;
