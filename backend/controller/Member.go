package controller

import (
	"net/http"

	"github.com/Thadthon08/sa-66-Comic/entity"
	"github.com/gin-gonic/gin"
)

func GetMemberById(c *gin.Context) {
	var member entity.Member
	id := c.Param("id")

	if err := entity.DB().Preload("Gender").Raw("SELECT * FROM members WHERE id = ?", id).Find(&member).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": member})
}
