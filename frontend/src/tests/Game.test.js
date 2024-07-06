import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from '../components/Game';

describe('Game Component', () => {
  let ctx;

  beforeEach(() => {
    ctx = {
      drawImage: jest.fn(),
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      rect: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
    };
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the start button', () => {
    render(<Game />);
    const startButton = screen.getByText('Start');
    expect(startButton).toBeInTheDocument();
  });

  it('moves the bird up when space key is pressed', async () => {
    render(<Game />);
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(ctx.drawImage).toHaveBeenCalled();
    });

    const birdBeforeJumpY = 200; 
    fireEvent.keyUp(window, { key: ' ', code: 'Space' });

    const birdAfterJumpY = birdBeforeJumpY - 45; 

    expect(birdAfterJumpY).toBeLessThan(birdBeforeJumpY);
  });
});
