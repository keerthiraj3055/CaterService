import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeLayout from '../layout/EmployeeLayout';

const EmployeeRoot = () => (
  <EmployeeLayout>
    <Outlet />
  </EmployeeLayout>
);

export default EmployeeRoot;
