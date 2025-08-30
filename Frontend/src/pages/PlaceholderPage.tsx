import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="p-6 text-center text-gray-500">
      Placeholder for {title}
    </div>
  );
};

export default PlaceholderPage;
