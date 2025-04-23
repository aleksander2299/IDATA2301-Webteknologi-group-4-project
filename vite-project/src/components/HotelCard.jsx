import React from 'react';
import PropTypes from 'prop-types';

// Import the specific CSS for this component
import '../styles/HotelCard.css';

const DEFAULT_IMAGE_URL = '/images/placeholder-hotel.png';

function HotelCard({
  id,
  imageUrl,
  imageAlt,
  title,
  description,
  children,
}) {
  return (
        <div className="hotel-card" hotel-id={id}>
              <div className="hotel-card-image-container">
                <img
                  // Use provided imageUrl or fallback to default
                  src={imageUrl || DEFAULT_IMAGE_URL}
                  // Use provided alt text or a generic default
                  alt={imageAlt || 'Hotel room or property'}
                  // On Error use placeholder
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE_URL;
                  }}
                />
              </div>

              <div className="hotel-card-info">
                {/* Conditionally render title if provided */}
                {title && <h3 className="hotel-card-title">{title}</h3>}
                {/* Conditionally render description if provided */}
                {description && <p className="hotel-card-description">{description}</p>}
              </div>

              {/* Render action buttons passed as children */}
              {children && <div className="hotel-card-actions">{children}</div>}
            </div>
      )
  }
HotelCard.defaultProps = {
  imageUrl: DEFAULT_IMAGE_URL,
  imageAlt: 'Hotel room or property',
  title: '',
  description: '',
  children: null,
};

export default HotelCard;