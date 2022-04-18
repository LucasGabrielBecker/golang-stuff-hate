package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	var err error
	db, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Book{})
	db.AutoMigrate(&Comment{})
	db.FirstOrCreate(&Book{Title: "Harry Potter", UpVotes: 0, DownVotes: 0, Author: "J. K. Rowling"})
	db.FirstOrCreate(&Book{Title: "The lorf of the Rings", UpVotes: 0, DownVotes: 0, Author: "J. R. R. Tolkien"})
	db.FirstOrCreate(&Book{Title: "The Wizard of Oz", UpVotes: 0, DownVotes: 0, Author: "L. Frank Baum"})

	handler := newHandler(db)

	r := gin.New()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "POST", "DELETE", "GET"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "https://github.com"
		},
		MaxAge: 12 * time.Hour,
	}))
	r.GET("/status", handler.healthCheckHandler)
	r.GET("/books", handler.getAllBooksHandler)
	r.POST("/book", handler.createBookHandler)
	r.DELETE("/books/:id", handler.deleteBookHandler)
	r.POST("/books/upvote/:id", handler.upVote)
	r.POST("/books/downvote/:id", handler.downVote)
	r.POST("/books/add-comment/:id", handler.addCommentHandler)
	r.Run()
}

type Book struct {
	gorm.Model
	ID        int64  `gorm:"primary_key, auto_increment"`
	Title     string `json:"title"`
	Author    string `json:"author"`
	UpVotes   int    `json:"upVotes"`
	DownVotes int    `json:"downVotes"`
	Comments  []Comment
}

type Comment struct {
	gorm.Model
	Content string `json:"content"`
	BookId  uint
}

type Handler struct {
	db *gorm.DB
}

func newHandler(db *gorm.DB) *Handler {
	return &Handler{db}
}

func (h *Handler) getAllBooksHandler(c *gin.Context) {
	var books []Book

	if result := h.db.Preload("Comments").Find(&books); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, &books)
}

func (h *Handler) createBookHandler(c *gin.Context) {
	var book Book

	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if result := h.db.Create(&book); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, &book)
}

func (h *Handler) healthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "OK",
	})
}

func (h *Handler) deleteBookHandler(c *gin.Context) {
	id := c.Param("id")

	if result := h.db.Delete(&Book{}, id); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": result.Error.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *Handler) upVote(c *gin.Context) {
	id := c.Param("id")
	var book Book

	h.db.Find(&book, id)
	book.UpVotes++
	h.db.Save(&book)
	c.Status(http.StatusNoContent)
}

func (h *Handler) downVote(c *gin.Context) {
	id := c.Param("id")
	var book Book

	h.db.Find(&book, id)
	book.DownVotes++
	h.db.Save(&book)
	c.Status(http.StatusNoContent)
}

type Content struct {
	Content string `json:"content"`
}

func (h *Handler) addCommentHandler(c *gin.Context) {
	id := c.Param("id")
	var body Content
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var book Book
	h.db.Find(&book, id)
	book.Comments = append(book.Comments, Comment{Content: body.Content})
	h.db.Save(&book)
}
