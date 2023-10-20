package controller

import (
	"net/http"

	"github.com/Thadthon08/sa-66-Comic/entity"
	"github.com/gin-gonic/gin"
)

func CreateBasket(c *gin.Context) {
	var basket entity.Basket
	var member entity.Member
	var comic entity.Comic

	// bind เข้าตัวแปร comic
	if err := c.ShouldBindJSON(&basket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errorb": err.Error()})
		return
	}
	//ค้าหา member ด้วย id
	if tx := entity.DB().Where("id = ?", basket.MemberID).First(&member); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "member not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", basket.ComicID).First(&comic); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "comic not found"})
		return
	}

	//สร้าง comic
	co := entity.Basket{
		Total:  basket.Total,
		Member: member,
		Comic:  comic,
	}

	//บันทึก
	if err := entity.DB().Create(&co).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errorC": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": co})

}

func GetBasket(c *gin.Context) {
	var baskets []entity.Comic
	id := c.Param("id")
	cid := c.Param("cid")
	if err := entity.DB().Preload("Member").Preload("Comic").Raw("SELECT * FROM baskets WHERE member_id = ? AND comic_id = ?", id, cid).Find(&baskets).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": baskets})
}

// GET /comic
func ListBasket(c *gin.Context) {
	var baskets []entity.Comic
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM baskets WHERE member_id = ?", id).Find(&baskets).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": baskets})
}

// DELETE /comic/:id
func DeleteBasket(c *gin.Context) {
	id := c.Param("id")
	cid := c.Param("cid")
	if tx := entity.DB().Exec("DELETE FROM baskets WHERE member_id = ? AND comic_id = ?", id, cid); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "basket not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}
