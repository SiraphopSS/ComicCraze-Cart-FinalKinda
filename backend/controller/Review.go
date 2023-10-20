package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/Thadthon08/sa-66-Comic/entity"
)

// POST /review
func Createreview(c *gin.Context) {
	var review entity.Review
	var Rating entity.Rating

	// bind เข้าตัวแปร review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา rating ด้วย id
	if tx := entity.DB().Where("id = ?", review.RatingID).First(&Rating); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ratings not found"})
		return
	}

	

	// สร้าง review
	u := entity.Review{
		Rating:   Rating,    // โยงความสัมพันธ์กับ Entity Rating
		ComicID:  review.ComicID, // ตั้งค่าฟิลด์ Comic_id
		Comment:  review.Comment,  // ตั้งค่าฟิลด์ Comment
		// NameComic: review.NameComic,  // ตั้งค่าฟิลด์ Namecomnic
		
		
	}

	// บันทึก
	if err := entity.DB().Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": u})
}

// GET /review/:id
func GetReview(c *gin.Context) {
	var review entity.Review
	id := c.Param("id")
	if err := entity.DB().Preload("Rating").Raw("SELECT * FROM reviews WHERE id = ?", id).Find(&review).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": review})
}

// GET /review
func ListReviews(c *gin.Context) {
	var review []entity.Review
	if err := entity.DB().Preload("Rating").Raw("SELECT * FROM reviews").Find(&review).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": review})
}

// PATCH /review
func UpdateReview(c *gin.Context) {
	var review entity.Review
	var result entity.Review

	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา review ด้วย id
	if tx := entity.DB().Where("id = ?",review.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "review not found"})
		return
	}

	if err := entity.DB().Save(&review).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": review})
}

func CalculateAverageRatings(c *gin.Context) {
	var review entity.Review

	if err := entity.DB().Raw("SELECT Comic_id, AVG(rating_id) AS average_rate From reviews GROUP BY Comic_id ").Scan(&review).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": review})
}	


