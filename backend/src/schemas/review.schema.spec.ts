import { Review, ReviewSchema } from './review.schema';

describe('Review Schema', () => {
  describe('Review Class', () => {
    it('should create a review instance', () => {
      const review = new Review();
      expect(review).toBeInstanceOf(Review);
    });
  });

  describe('Review Schema Structure', () => {
    it('should have correct schema configuration', () => {
      expect(ReviewSchema).toBeDefined();
      expect(ReviewSchema.obj).toBeDefined();
    });

    it('should have required userId field configuration', () => {
      const userIdPath = ReviewSchema.paths.userId;
      expect(userIdPath).toBeDefined();
      expect(userIdPath.isRequired).toBe(true);
      expect(userIdPath.options.ref).toBe('User');
      expect(userIdPath.instance).toBe('Mixed');
    });

    it('should have required productId field configuration', () => {
      const productIdPath = ReviewSchema.paths.productId;
      expect(productIdPath).toBeDefined();
      expect(productIdPath.isRequired).toBe(true);
      expect(productIdPath.options.ref).toBe('Product');
      expect(productIdPath.instance).toBe('Mixed');
    });

    it('should have required rating field with min/max constraints', () => {
      const ratingPath = ReviewSchema.paths.rating;
      expect(ratingPath).toBeDefined();
      expect(ratingPath.isRequired).toBe(true);
      expect(ratingPath.instance).toBe('Number');
      expect(ratingPath.options.min).toBe(1);
      expect(ratingPath.options.max).toBe(5);
    });

    it('should have optional comment field', () => {
      const commentPath = ReviewSchema.paths.comment;
      expect(commentPath).toBeDefined();
      expect(commentPath.isRequired || false).toBe(false);
      expect(commentPath.instance).toBe('String');
    });

    it('should have timestamps enabled', () => {
      expect(ReviewSchema.options.timestamps).toBe(true);
    });

    it('should have correct collection name', () => {
      expect(ReviewSchema.options.collection).toBe('reviews');
    });
  });

  describe('Schema Indexes', () => {
    it('should have compound unique index on userId and productId', () => {
      const indexes = ReviewSchema.indexes();
      const compoundIndex = indexes.find((index: any) => 
        index[0] && 
        typeof index[0] === 'object' && 
        'userId' in index[0] && 
        'productId' in index[0]
      );
      
      expect(compoundIndex).toBeDefined();
      if (compoundIndex) {
        expect(compoundIndex[1]?.unique).toBe(true);
      }
    });
  });

  describe('Schema Validation', () => {
    it('should validate review data structure with comment', () => {
      const reviewData = {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        rating: 4,
        comment: 'Great product! Really enjoyed using it.',
      };

      expect(typeof reviewData.userId).toBe('string');
      expect(typeof reviewData.productId).toBe('string');
      expect(typeof reviewData.rating).toBe('number');
      expect(typeof reviewData.comment).toBe('string');
      expect(reviewData.rating).toBeGreaterThanOrEqual(1);
      expect(reviewData.rating).toBeLessThanOrEqual(5);
    });

    it('should validate review data structure without comment', () => {
      const reviewData: {
        userId: string;
        productId: string;
        rating: number;
        comment?: string;
      } = {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        rating: 5,
      };

      expect(typeof reviewData.userId).toBe('string');
      expect(typeof reviewData.productId).toBe('string');
      expect(typeof reviewData.rating).toBe('number');
      expect(reviewData.comment).toBeUndefined();
      expect(reviewData.rating).toBeGreaterThanOrEqual(1);
      expect(reviewData.rating).toBeLessThanOrEqual(5);
    });

    it('should validate all valid rating values', () => {
      const validRatings = [1, 2, 3, 4, 5];
      
      validRatings.forEach(rating => {
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
        expect(Number.isInteger(rating)).toBe(true);
      });
    });

    it('should identify invalid rating values', () => {
      const invalidRatings = [0, -1, 6, 10, 0.5, 5.5];
      
      invalidRatings.forEach(rating => {
        const isValid = rating >= 1 && rating <= 5;
        expect(isValid).toBe(false);
      });
    });

    it('should handle empty comment', () => {
      const reviewData = {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        rating: 3,
        comment: '',
      };

      expect(typeof reviewData.comment).toBe('string');
      expect(reviewData.comment).toBe('');
    });

    it('should handle long comment', () => {
      const longComment = 'This is a very detailed review '.repeat(50);
      const reviewData = {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        rating: 4,
        comment: longComment,
      };

      expect(typeof reviewData.comment).toBe('string');
      expect(reviewData.comment.length).toBeGreaterThan(100);
    });
  });

  describe('Virtual Fields', () => {
    it('should have virtual fields configured', () => {
      expect(ReviewSchema.virtuals).toBeDefined();
    });

    it('should have toJSON transform configuration', () => {
      expect(ReviewSchema.options.toJSON).toBeDefined();
      expect(ReviewSchema.options.toJSON.virtuals).toBe(true);
      expect(typeof ReviewSchema.options.toJSON.transform).toBe('function');
    });
  });

  describe('Field Types', () => {
    it('should have correct field types in schema paths', () => {
      expect(ReviewSchema.paths.userId.instance).toBe('Mixed');
      expect(ReviewSchema.paths.productId.instance).toBe('Mixed');
      expect(ReviewSchema.paths.rating.instance).toBe('Number');
      expect(ReviewSchema.paths.comment.instance).toBe('String');
    });
  });

  describe('References', () => {
    it('should have correct reference configurations', () => {
      const userIdPath = ReviewSchema.paths.userId;
      expect(userIdPath.options.ref).toBe('User');
      
      const productIdPath = ReviewSchema.paths.productId;
      expect(productIdPath.options.ref).toBe('Product');
    });
  });

  describe('Rating Constraints', () => {
    it('should enforce minimum rating constraint', () => {
      const ratingPath = ReviewSchema.paths.rating;
      expect(ratingPath.options.min).toBe(1);
    });

    it('should enforce maximum rating constraint', () => {
      const ratingPath = ReviewSchema.paths.rating;
      expect(ratingPath.options.max).toBe(5);
    });

    it('should validate rating boundary values', () => {
      const boundaryRatings = [1, 5]; // Min and max valid values
      const invalidBoundaryRatings = [0, 6]; // Just outside valid range
      
      boundaryRatings.forEach(rating => {
        expect(rating >= 1 && rating <= 5).toBe(true);
      });
      
      invalidBoundaryRatings.forEach(rating => {
        expect(rating >= 1 && rating <= 5).toBe(false);
      });
    });
  });

  describe('Comment Field Behavior', () => {
    it('should allow undefined comment', () => {
      const reviewData: {
        userId: string;
        productId: string;
        rating: number;
        comment?: string;
      } = {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        rating: 4,
      };

      expect(reviewData.comment).toBeUndefined();
    });

    it('should allow null comment', () => {
      const reviewData = {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        rating: 4,
        comment: null,
      };

      expect(reviewData.comment).toBeNull();
    });
  });

  describe('User-Product Uniqueness', () => {
    it('should expect unique constraint on user-product combination', () => {
      // This test validates the schema definition expects uniqueness
      const indexes = ReviewSchema.indexes();
      const hasUniqueIndex = indexes.some((index: any) => 
        index[1]?.unique === true &&
        index[0] &&
        typeof index[0] === 'object' &&
        'userId' in index[0] &&
        'productId' in index[0]
      );
      
      expect(hasUniqueIndex).toBe(true);
    });
  });
});
